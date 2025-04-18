// src/pages/category/CategoryPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../components/layouts/AdminLayout";
import { useAuth } from "../../hooks/useAuth";
import CategoryForm from "./components/CategoryForm";
import {
  useCategories,
  useCategoryDetail,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./hooks";

const CategoryPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<"none" | "add" | "edit" | "view">(
    "none"
  );
  const [currentCategoryId, setCurrentCategoryId] = useState<
    number | undefined
  >();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Use custom hooks for API operations
  const { categories, loading, error, totalPages } = useCategories(token, {
    page,
    name: search || undefined,
  });

  const { category, loading: loadingDetail } = useCategoryDetail(
    token,
    currentCategoryId
  );

  const {
    createCategory,
    loading: creating,
    error: createError,
    response: createResponse,
  } = useCreateCategory();

  const {
    updateCategory,
    loading: updating,
    error: updateError,
    response: updateResponse,
  } = useUpdateCategory();

  const {
    deleteCategory,
    loading: deleting,
    error: deleteError,
    successMessage: deleteMessage,
  } = useDeleteCategory();

  // Reset form if going from edit/view to add mode
  useEffect(() => {
    if (formMode === "add") {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [formMode]);

  // Populate form with category data when viewing or editing
  useEffect(() => {
    if (category && (formMode === "edit" || formMode === "view")) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category, formMode]);

  // Handle successful operations
  useEffect(() => {
    if (createResponse) {
      toast.success("Category successfully added!");
      setFormMode("none");
      setCurrentCategoryId(undefined);
      navigate("/admin/categories");
    }

    if (updateResponse) {
      toast.success("Category successfully updated!");
      setFormMode("none");
      setCurrentCategoryId(undefined);
      navigate("/admin/categories");
    }

    if (deleteMessage) {
      toast.success("Category successfully deleted!");
      navigate("/admin/categories");
    }
  }, [createResponse, updateResponse, deleteMessage, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formMode === "add") {
      await createCategory(token, formData);
    } else if (formMode === "edit" && currentCategoryId) {
      await updateCategory(token, currentCategoryId, formData);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(token, id);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <button
            onClick={() => {
              setCurrentCategoryId(undefined);
              setFormMode("add");
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            Add New Categories
          </button>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name"
            className="border rounded px-4 py-2 w-full md:w-1/3"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Dynamic Form */}
        {formMode !== "none" && (
          <CategoryForm
            formMode={formMode}
            formData={formData}
            loadingDetail={loadingDetail}
            creating={creating}
            updating={updating}
            errorMessage={createError ?? updateError ?? undefined}
            onClose={() => setFormMode("none")}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        )}

        {/* Table */}
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : categories && categories.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm">
                    <th className="p-3 border w-[30%]">Name</th>
                    <th className="p-3 border w-[45%]">Description</th>
                    <th className="p-3 border w-[25%] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 text-sm">
                      <td className="p-3 border">{category.name}</td>
                      <td className="p-3 border max-w-[300px] truncate">
                        {category.description || "-"}
                      </td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => {
                            setCurrentCategoryId(category.id);
                            setFormMode("edit");
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={deleting}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No categories found.</p>
        )}

        {/* Error messages */}
        {deleteError && <p className="text-red-500 mt-4">{deleteError}</p>}
      </div>
    </AdminLayout>
  );
};

export default CategoryPage;
