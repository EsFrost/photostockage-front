import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { createEditor, Descendant, BaseEditor } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import { Photo, Comment, User, Category } from "@/app/utils/interfaces";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";

// Define custom types for plain text editor
type CustomElement = {
  type: "paragraph";
  children: CustomText[];
};

type CustomText = {
  text: string;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

interface CommentWithUser extends Comment {
  username?: string;
  user_icon?: string;
}

export const MyPhotos = () => {
  const [images, setImages] = useState<Photo[]>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Slate editor setup
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue);

  const renderElement = useCallback((props: any) => {
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  const fetchUserPhotos = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(
        `http://localhost:3000/photos/photos/user/${userId}`,
        {
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch images"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (photoId: string) => {
    try {
      const [commentsResponse, usersResponse] = await Promise.all([
        fetch(`http://localhost:3000/comments/photo/${photoId}`, {
          headers: { Accept: "application/json" },
        }),
        fetch(`http://localhost:3000/user/users`, {
          headers: { Accept: "application/json" },
        }),
      ]);

      if (!commentsResponse.ok || !usersResponse.ok) {
        throw new Error("Failed to fetch comments");
      }

      const commentsData = await commentsResponse.json();
      const usersData = await usersResponse.json();

      // Create a map of user data
      const userMap = new Map<string, { username: string; user_icon: string }>(
        usersData.map((user: User) => [
          user.id,
          { username: user.username, user_icon: user.user_icon },
        ])
      );

      // Add user data to comments
      const commentsWithUsers = commentsData.map((comment: Comment) => {
        const userData = userMap.get(comment.id_user);
        return {
          ...comment,
          username: userData?.username || "Unknown User",
          user_icon: userData?.user_icon || "",
        } as CommentWithUser;
      });

      setComments(commentsWithUsers);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPhotos();
  }, []);

  const handleEditClick = async (photo: Photo) => {
    setEditingPhoto(photo);
    setName(photo.name);
    setStatus(photo.status);
    setEditorValue([
      {
        type: "paragraph",
        children: [{ text: photo.description || "" }],
      },
    ]);

    // Fetch categories and current photo's category
    try {
      const [categoriesResponse, currentCategoryResponse] = await Promise.all([
        fetch("http://localhost:3000/categories", {
          headers: { Accept: "application/json" },
        }),
        fetch(`http://localhost:3000/photos_categories/photo/${photo.id}`, {
          headers: { Accept: "application/json" },
        }),
      ]);

      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      if (currentCategoryResponse.ok) {
        const categoryData = await currentCategoryResponse.json();
        if (categoryData && categoryData.length > 0) {
          setSelectedCategory(categoryData[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }

    setCommentsLoading(true);
    await fetchComments(photo.id);
  };

  const handleSave = async () => {
    if (!editingPhoto) return;

    try {
      setIsSaving(true);
      const description = editorValue
        .map((node) => {
          if ("children" in node) {
            return (node.children[0] as CustomText).text;
          }
          return "";
        })
        .join("\n")
        .trim();

      const response = await fetch(
        `http://localhost:3000/photos/edit/${editingPhoto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            description,
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update photo");
      }

      // Update category if changed
      if (selectedCategory) {
        // First, we'll add the new category relationship
        await fetch(`http://localhost:3000/photos_categories/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            photo_id: editingPhoto.id,
            category_id: selectedCategory,
          }),
        });
      }

      // Refresh the photos list
      await fetchUserPhotos();
      setEditingPhoto(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update photo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPhoto) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this photo? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(
        `http://localhost:3000/photos/delete/${editingPhoto.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      // Refresh the photos list
      await fetchUserPhotos();
      setEditingPhoto(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!images?.length) {
    return <div>No photos found. Start by uploading some photos!</div>;
  }

  if (editingPhoto) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center">
          <button
            onClick={() => setEditingPhoto(null)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Photos
          </button>
        </div>

        {/* Photo preview */}
        <div className="relative w-full h-[400px]">
          <Image
            src={editingPhoto.path}
            alt={editingPhoto.name}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        {/* Edit form */}
        <div className="space-y-6">
          {/* Name field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Photo Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={editingPhoto.name}
            />
          </div>

          {/* Category field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="border border-gray-300 rounded-md">
              <Slate
                editor={editor}
                initialValue={editorValue}
                onChange={(value) => setEditorValue(value)}
              >
                <Editable
                  className="min-h-[150px] p-2"
                  placeholder={
                    editingPhoto.description || "Enter a description..."
                  }
                  renderElement={renderElement}
                />
              </Slate>
            </div>
          </div>

          {/* Status toggle and action buttons */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={status}
                    onChange={() => setStatus(true)}
                    className="mr-2"
                  />
                  Visible
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!status}
                    onChange={() => setStatus(false)}
                    className="mr-2"
                  />
                  Hidden
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete Photo"}
              </button>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {commentsLoading ? (
            <div>Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-gray-500 text-center">No comments yet</div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment: CommentWithUser, index) => (
                <div
                  key={`${comment.id}-${index}`}
                  className={`${
                    index % 2 === 0 ? "bg-[#6366F1] bg-opacity-10" : ""
                  } border border-gray-200 rounded-md p-4 flex flex-col`}
                >
                  <div className="text-gray-800">{comment.content}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {comment.user_icon ? (
                      <Image
                        src={comment.user_icon}
                        alt="User avatar"
                        width={24}
                        height={24}
                        className="rounded-full object-cover w-6 h-6"
                      />
                    ) : (
                      <FaRegCircleUser className="w-6 h-6 text-gray-600" />
                    )}
                    <span className="text-sm text-gray-600">
                      {comment.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-around gap-[30px] mt-5 mx-2 md:mx-8">
      {images.map((image) => (
        <div
          key={image.id}
          className="
            p-[15px] pb-[60px] 
            shadow-[5px_15px_15px_rgb(225,225,225)] 
            h-full relative
            hover:shadow-[-5px_15px_15px_rgb(225,225,225)] 
            hover:scale-[1.1] 
            transition-all duration-500 
            after:content-[attr(polaroid-caption)] 
            after:absolute after:bottom-0 after:left-0 
            after:w-full after:text-center 
            after:p-[10px] after:text-[30px]
            after:transition-all after:opacity-50 
            after:hover:opacity-100 after:duration-1000
            mx-auto
            border border-1 border-gray-100
            cursor-pointer
          "
          polaroid-caption={image.name}
          onClick={() => handleEditClick(image)}
        >
          <Image
            src={image.path}
            width={0}
            height={0}
            alt={image.name}
            sizes="100vw"
            className="max-w-[250px] min-w-[250px] w-auto h-auto opacity-50 hover:opacity-100 transition-all duration-500 mx-auto"
          />
        </div>
      ))}
    </div>
  );
};

export default MyPhotos;
