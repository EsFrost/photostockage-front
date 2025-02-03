import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { createEditor, Descendant, BaseEditor } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Category } from "@/app/utils/interfaces";

// Define custom types for plain text
type CustomElement = {
  type: "paragraph";
  children: CustomText[];
};

type CustomText = {
  text: string;
};

// Extend Slate's custom types
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialEditorValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const AddPhotoForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    status: true, // visible by default
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedPhotoId, setUploadedPhotoId] = useState<string>("");
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryError, setcategoryError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [editorValue, setEditorValue] =
    useState<Descendant[]>(initialEditorValue);

  const renderElement = useCallback((props: any) => {
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setcategoryError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        // 8MB limit
        setError("File size must be less than 8MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("File must be an image");
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const clearForm = () => {
    setFormData({ name: "", status: true });
    setPhoto(null);
    setPreviewUrl("");
    setEditorValue(initialEditorValue);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      setError("Please select a photo to upload");
      return;
    }
    if (!formData.name.trim()) {
      setError("Please enter a name for the photo");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // First upload the photo file
      const fileData = new FormData();
      const fileIdentifier = crypto.randomUUID();
      fileData.append("file", photo);
      fileData.append("identifier", fileIdentifier);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: fileData,
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Failed to upload photo");
      }

      // Then create the photo record
      const photoData = {
        name: formData.name,
        description: editorValue
          .map((node) => {
            if ("children" in node) {
              return (node.children[0] as CustomText).text;
            }
            return "";
          })
          .join("\n")
          .trim(),
        path: uploadResult.fileUrl,
        status: formData.status,
      };

      const createResponse = await fetch(
        "http://localhost:3000/photos/add_photo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(photoData),
        }
      );

      const createResult = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(
          createResult.message || "Failed to create photo record"
        );
      }

      setUploadedPhotoId(createResult.id);

      if (selectedCategory) {
        await fetch(`http://localhost:3000/photos_categories/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            photo_id: uploadedPhotoId,
            category_id: selectedCategory,
          }),
        });
      }

      setUploadSuccess(true);
      clearForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="text-center p-6">
        <p className="text-green-600 mb-4">Photo uploaded successfully!</p>
        <button
          onClick={() => setUploadSuccess(false)}
          className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded mt-4"
        >
          Upload Another Photo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        {/* Photo Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {previewUrl ? (
            <div className="relative">
              <Image
                src={previewUrl}
                alt="Preview"
                width={300}
                height={300}
                className="mx-auto object-contain max-h-[300px]"
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setPreviewUrl("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click to upload a photo
              </p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Category Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categoryError && (
            <p className="text-red-500 text-sm mt-1">{categoryError}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1 border border-gray-300 rounded-md">
            <Slate
              editor={editor}
              initialValue={editorValue}
              onChange={(value) => setEditorValue(value)}
            >
              <Editable
                className="h-[150px] p-2"
                placeholder="Enter a description..."
                renderElement={renderElement}
              />
            </Slate>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={formData.status}
              onChange={() => setFormData({ ...formData, status: true })}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Visible</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={!formData.status}
              onChange={() => setFormData({ ...formData, status: false })}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Hidden</span>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={clearForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPhotoForm;
