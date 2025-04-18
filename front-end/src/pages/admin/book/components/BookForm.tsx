import React, { useState, useEffect } from "react";
import { Category } from "../../../../services/book/interface";

interface BookFormProps {
  formMode: "add" | "edit" | "view";
  formData: {
    title: string;
    author: string;
    isbn: string;
    description: string;
    stock: number;
    publication_year: number;
    publisher: string;
    category_id: string;
  };
  coverImage: File | null;
  bookCoverImage?: string;
  loadingDetail: boolean;
  creating: boolean;
  updating: boolean;
  errorMessage?: string;
  categories: Category[];
  onClose: () => void;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const BookForm: React.FC<BookFormProps> = ({
  formMode,
  formData,
  bookCoverImage,
  loadingDetail,
  creating,
  updating,
  errorMessage,
  categories,
  onClose,
  onChange,
  onFileChange,
  onSubmit,
}) => {
  const isViewMode = formMode === "view";
  const isLoading = loadingDetail || creating || updating;
  const [imageError, setImageError] = useState(false);

  // Format image URL properly
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "";

    // If it's already a full URL (starts with http/https), use it directly
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Otherwise, assume it's a relative path and add the base API URL
    // Replace this with your actual API base URL
    const apiBaseUrl =
      import.meta.env.REACT_APP_API_URL || "http://localhost:8000";
    return `${apiBaseUrl}/storage/${imagePath}`;
  };

  // Reset image error state when bookCoverImage changes
  useEffect(() => {
    setImageError(false);
  }, [bookCoverImage]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {formMode === "add"
            ? "Add New Book"
            : formMode === "edit"
            ? "Edit Book"
            : "Book Details"}
        </h2>
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
        >
          Close
        </button>
      </div>

      {isLoading && <p className="my-4">Loading...</p>}
      {errorMessage && <p className="text-red-500 my-4">{errorMessage}</p>}

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Title", name: "title", type: "text" },
            { label: "Author", name: "author", type: "text" },
            { label: "ISBN", name: "isbn", type: "text" },
            { label: "Publisher", name: "publisher", type: "text" },
            {
              label: "Publication Year",
              name: "publication_year",
              type: "number",
              min: 1900,
              max: new Date().getFullYear(),
            },
            { label: "Stock", name: "stock", type: "number", min: 0 },
          ].map((field) => (
            <div className="space-y-2" key={field.name}>
              <label className="block text-sm font-medium">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={onChange}
                className="border rounded px-3 py-2 w-full"
                disabled={isViewMode}
                required
                min={field.min}
                max={field.max}
              />
            </div>
          ))}

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full"
              disabled={isViewMode}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Cover Image</label>
            {bookCoverImage &&
              (formMode === "view" || formMode === "edit") &&
              !imageError && (
                <div className="mb-2">
                  <img
                    src={getImageUrl(bookCoverImage)}
                    alt={formData.title}
                    className="h-36 w-auto object-contain border rounded"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
            {(imageError || !bookCoverImage) &&
              (formMode === "view" || formMode === "edit") && (
                <div className="mb-2 bg-gray-200 h-36 flex items-center justify-center rounded">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            {!isViewMode && (
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full"
              />
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full h-24"
              disabled={isViewMode}
            />
          </div>
        </div>

        {!isViewMode && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={creating || updating}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {creating || updating
                ? "Saving..."
                : formMode === "add"
                ? "Create Book"
                : "Update Book"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookForm;
