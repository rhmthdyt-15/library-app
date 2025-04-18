// src/pages/member/catalog/index.tsx
import React, { useState } from "react";
import MemberLayout from "../../../components/layouts/MemberLayout";
import { Book } from "../../../services/book/interface";
import { useBooks, useCategories } from "./hooks";
import BookDetailModal from "./components/BookDetailModal";
import { getImageUrl } from "../../../utils/url";

const CatalogBookPage: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();

  // Build query params object conditionally - only include non-empty values
  const queryParams = {
    page,
    ...(search ? { title: search } : {}),
    ...(categoryId !== undefined ? { category_id: categoryId } : {}),
  };

  const { books, loading, error, pagination } = useBooks(queryParams);
  const { categories } = useCategories();

  const handleViewDetail = (bookId: number) => {
    setSelectedBookId(bookId);
  };

  const handleCloseModal = () => {
    setSelectedBookId(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Find the selected book from the books list
  const selectedBook = books.find((book) => book.id === selectedBookId) || null;

  return (
    <MemberLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Katalog Buku</h1>

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

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada buku yang ditemukan.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                {books.map((book: Book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="h-64 overflow-hidden">
                      {book.cover_image ? (
                        <img
                          src={getImageUrl(book.cover_image)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Cover</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-between h-48">
                      <div>
                        <h2 className="text-lg font-semibold line-clamp-1">
                          {book.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Penulis: {book.author}
                        </p>
                        <p className="text-sm text-gray-600">
                          Tahun: {book.publication_year}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {book.category?.name || "Uncategorized"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Stok: {book.stock}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewDetail(book.id)}
                        className="mt-3 text-sm bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination - stilnya tetap sama seperti di katalog */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className={`px-3 py-1 rounded-l-md border ${
                        pagination.currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 border-t border-b ${
                          pagination.currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className={`px-3 py-1 rounded-r-md border ${
                        pagination.currentPage === pagination.totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBookId}
        onClose={handleCloseModal}
      />
    </MemberLayout>
  );
};

export default CatalogBookPage;
