import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { createEditor, Descendant, BaseEditor } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

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

interface CommentWithUser {
  comment_id: string;
  comment_status: boolean;
  content: string;
  photo_id: string;
  photo_name: string;
  photo_status: boolean;
  user_icon: string;
  username: string;
  photo?: {
    name: string;
    path: string;
  };
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export const MyComments = () => {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState<CommentWithUser | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [editorValue, setEditorValue] = useState<Descendant[]>(initialValue);

  const renderElement = useCallback((props: any) => {
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  const fetchComments = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const commentsResponse = await fetch(
        `http://localhost:3000/comments/user/${userId}`,
        {
          headers: { Accept: "application/json" },
          credentials: "include",
        }
      );

      if (!commentsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const commentsData = await commentsResponse.json();

      // Fetch photo details for each comment
      const commentsWithPhotos = await Promise.all(
        commentsData.map(async (comment: CommentWithUser) => {
          const photoResponse = await fetch(
            `http://localhost:3000/photos/photo/${comment.photo_id}`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!photoResponse.ok) {
            throw new Error(
              `Failed to fetch photo for comment ${comment.comment_id}`
            );
          }

          const photoData = await photoResponse.json();
          return {
            ...comment,
            photo: {
              name: photoData.name,
              path: photoData.path,
            },
          };
        })
      );
      setComments(commentsWithPhotos);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch comments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleEditClick = (comment: CommentWithUser) => {
    setEditingComment(comment);
    setEditorValue([
      {
        type: "paragraph",
        children: [{ text: comment.content || "" }],
      },
    ]);
  };

  const handleSave = async () => {
    if (!editingComment) return;

    try {
      setIsSaving(true);
      const content = editorValue
        .map((node) => {
          if ("children" in node) {
            return (node.children[0] as CustomText).text;
          }
          return "";
        })
        .join("\n")
        .trim();

      const response = await fetch(
        `http://localhost:3000/comments/edit/${editingComment.comment_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      // Refresh comments list
      await fetchComments();
      setEditingComment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update comment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingComment) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(
        `http://localhost:3000/comments/delete/${editingComment.comment_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Refresh comments list
      await fetchComments();
      setEditingComment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
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

  if (editingComment) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center">
          <button
            onClick={() => setEditingComment(null)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Comments
          </button>
        </div>

        {/* Updated photo preview */}
        {editingComment && editingComment.photo && (
          <div className="relative w-full h-[400px]">
            <Image
              src={editingComment.photo.path}
              alt={editingComment.photo.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment Content
            </label>
            <div className="border border-gray-300 rounded-md">
              <Slate
                editor={editor}
                initialValue={editorValue}
                onChange={(value) => setEditorValue(value)}
              >
                <Editable
                  className="min-h-[150px] p-2"
                  placeholder="Enter your comment..."
                  renderElement={renderElement}
                />
              </Slate>
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
              {isDeleting ? "Deleting..." : "Delete Comment"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          You haven&apos;t made any comments yet.
        </p>
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
        >
          Browse Photos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {comments.map((comment) => (
        <div
          key={comment.comment_id}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6"
        >
          <div className="w-full md:w-1/4">
            <Link href={`/photo/${comment.photo_id}`}>
              <div className="relative w-full pt-[100%]">
                <Image
                  src={
                    comment.photo?.path ||
                    `http://localhost:3000/photos/photo/${comment.photo_id}`
                  }
                  alt={comment.photo?.name || comment.photo_name}
                  fill
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            </Link>
          </div>

          <div className="flex-1">
            <Link
              href={`/photo/${comment.photo_id}`}
              className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 mb-2 block"
            >
              {comment.photo?.name || comment.photo_name}
            </Link>
            <p className="text-gray-700 mt-2">{comment.content}</p>
            <button
              onClick={() => handleEditClick(comment)}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Edit Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyComments;
