// src/pages/category/components/CategoryForm.tsx
import React from "react";

interface CategoryFormProps {
  formMode: "add" | "edit" | "view";
  formData: {
    name: string;
    description: string;
  };
  loadingDetail: boolean;
  creating: boolean;
  updating: boolean;
  errorMessage?: string;
  onClose: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  formMode,
  formData,
  loadingDetail,
  creating,
  updating,
  errorMessage,
  onClose,
  onChange,
  onSubmit,
}) => {
  const isViewMode = formMode === "view";
  const isLoading = loadingDetail || creating || updating;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {formMode === "add"
            ? "Add New Category"
            : formMode === "edit"
            ? "Edit Category"
            : "Category Details"}
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
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full"
              disabled={isViewMode}
              required
            />
          </div>

          <div className="space-y-2">
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
                ? "Create Category"
                : "Update Category"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CategoryForm;
