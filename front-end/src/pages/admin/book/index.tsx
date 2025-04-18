import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../../components/layouts/AdminLayout";
import { Category } from "../../../services/book/interface";
import {
  useBooks,
  useDeleteBook,
  useCreateBook,
  useUpdateBook,
  useBookDetail,
} from "./hooks";
import { getCategoriesService } from "../../../services/reports/http";
import BookForm from "./components/BookForm";

const BookPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formMode, setFormMode] = useState<"none" | "add" | "edit" | "view">(
    "none"
  );
  const [currentBookId, setCurrentBookId] = useState<number | undefined>();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    stock: 0,
    publication_year: new Date().getFullYear(),
    publisher: "",
    category_id: "",
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Build query params object conditionally - only include non-empty values
  const queryParams = {
    page,
    ...(search ? { title: search } : {}),
    ...(categoryId !== undefined ? { category_id: categoryId } : {}),
  };

  const { books, loading, error } = useBooks(queryParams);
  const { book, loading: loadingDetail } = useBookDetail(currentBookId);

  const {
    deleteBook,
    loading: deleting,
    error: deleteError,
    successMessage: deleteMessage,
  } = useDeleteBook();

  const {
    createBook,
    loading: creating,
    error: createError,
    response: createResponse,
  } = useCreateBook();

  const {
    updateBook,
    loading: updating,
    error: updateError,
    response: updateResponse,
  } = useUpdateBook();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategoriesService(
          localStorage.getItem("token") || ""
        );
        setCategories(result);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset form if going from edit/view to add mode
    if (formMode === "add") {
      setFormData({
        title: "",
        author: "",
        isbn: "",
        description: "",
        stock: 0,
        publication_year: new Date().getFullYear(),
        publisher: "",
        category_id: "",
      });
      setCoverImage(null);
    }
  }, [formMode]);

  useEffect(() => {
    // Populate form with book data when viewing or editing
    if (book && (formMode === "edit" || formMode === "view")) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || "",
        description: book.description || "",
        stock: book.stock,
        publication_year: book.publication_year,
        publisher: book.publisher,
        category_id: book.category_id.toString(),
      });
    }
  }, [book, formMode]);

  // Reset form and reload data after successful create/update
  useEffect(() => {
    if (createResponse) {
      toast.success("Buku berhasil ditambahkan!");
      setFormMode("none");
      setCurrentBookId(undefined);
      navigate("/admin/books");
    }

    if (updateResponse) {
      toast.success("Buku berhasil diperbarui!");
      setFormMode("none");
      setCurrentBookId(undefined);
      navigate("/admin/books");
    }
  }, [createResponse, updateResponse, navigate]);

  // Show toast for delete success
  useEffect(() => {
    if (deleteMessage) {
      toast.success("Buku berhasil dihapus!");
      navigate("/admin/books");
    }
  }, [deleteMessage, navigate]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      await deleteBook(id);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitFormData = new FormData();
    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        submitFormData.append(key, value.toString());
      }
    });

    // Add cover image if exists
    if (coverImage) {
      submitFormData.append("cover_image", coverImage);
    }

    if (formMode === "add") {
      await createBook(submitFormData);
    } else if (formMode === "edit" && currentBookId) {
      await updateBook(currentBookId, submitFormData);
    }
  };

  const renderForm = () => {
    if (formMode === "none") return null;

    return (
      <BookForm
        formMode={formMode}
        formData={formData}
        coverImage={coverImage}
        bookCoverImage={book?.cover_image}
        loadingDetail={loadingDetail}
        creating={creating}
        updating={updating}
        errorMessage={createError ?? updateError ?? undefined}
        categories={categories}
        onClose={() => setFormMode("none")}
        onChange={handleInputChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />
    );
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Books</h1>
          <button
            onClick={() => {
              setCurrentBookId(undefined);
              setFormMode("add");
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            Add New Book
          </button>
        </div>

        {/* Dynamic Form */}
        {renderForm()}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title"
            className="border rounded px-4 py-2 w-full md:w-1/3"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          <select
            className="border rounded px-4 py-2 w-full md:w-1/4"
            value={categoryId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setPage(1);
              setCategoryId(value === "" ? undefined : Number(value));
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : books && books.data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm">
                    <th className="p-3 border w-[25%]">Title</th>
                    <th className="p-3 border w-[20%]">Author</th>
                    <th className="p-3 border w-[20%]">Category</th>
                    <th className="p-3 border w-[10%] text-center">Stock</th>
                    <th className="p-3 border w-[25%] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.data.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 text-sm">
                      <td className="p-3 border max-w-[300px] truncate">
                        {book.title}
                      </td>
                      <td className="p-3 border max-w-[200px] truncate whitespace-nowrap">
                        {book.author}
                      </td>
                      <td className="p-3 border max-w-[200px] truncate">
                        {book.category?.name || "-"}
                      </td>
                      <td className="p-3 border text-center">{book.stock}</td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => {
                            setCurrentBookId(book.id);
                            setFormMode("view");
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setCurrentBookId(book.id);
                            setFormMode("edit");
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
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
                Page {books.current_page} of {books.last_page}
              </span>
              <button
                disabled={page >= books.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No books found.</p>
        )}

        {/* Error messages */}
        {deleteError && <p className="text-red-500 mt-4">{deleteError}</p>}
      </div>
    </AdminLayout>
  );
};

export default BookPage;
