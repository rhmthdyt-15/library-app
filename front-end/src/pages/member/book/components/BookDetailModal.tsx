import React, { useState } from "react";
import { Book } from "../../../../services/book/interface";
import { getImageUrl } from "../../../../utils/url";
import { createBorrowingService } from "../../../../services/borrowings/http";
import { useAuth } from "../../../../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const { token } = useAuth();

  if (!isOpen || !book) return null;

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Token tidak tersedia. Silakan login ulang.");
      return;
    }
    try {
      const payload = {
        book_id: book.id,
        borrow_date: borrowDate,
        due_date: dueDate,
        notes: notes || undefined,
      };
      const response = await createBorrowingService(token, payload);

      alert(response.message);
      setShowBorrowForm(false);
    } catch (err) {
      console.error(err);
      alert("Gagal meminjam buku. Silakan coba lagi.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Detail Buku</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover */}
            <div className="md:w-1/3">
              {book.cover_image ? (
                <img
                  src={getImageUrl(book.cover_image)}
                  alt={book.title}
                  width={250}
                  className="rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No Cover</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:w-2/3 space-y-2 text-gray-700">
              <h3 className="text-2xl font-semibold text-blue-700">
                {book.title}
              </h3>
              <p>
                <span className="font-semibold">Penulis:</span> {book.author}
              </p>
              <p>
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </p>
              <p>
                <span className="font-semibold">Penerbit:</span>{" "}
                {book.publisher}
              </p>
              <p>
                <span className="font-semibold">Tahun Terbit:</span>{" "}
                {book.publication_year}
              </p>
              <p>
                <span className="font-semibold">Kategori:</span>{" "}
                {book.category?.name || "-"}
              </p>
              <p>
                <span className="font-semibold">Stok:</span> {book.stock} buku
              </p>
            </div>
          </div>

          {/* Deskripsi */}
          {book.description && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Deskripsi:</h4>
              <p className="text-sm text-gray-600">
                {showFullDescription
                  ? book.description
                  : `${book.description.slice(0, 300)}...`}
              </p>
              {book.description.length > 300 && (
                <button
                  onClick={toggleDescription}
                  className="text-blue-600 mt-2 hover:underline text-sm"
                >
                  {showFullDescription ? "Sembunyikan" : "Baca Selengkapnya"}
                </button>
              )}
            </div>
          )}

          {/* Tombol Pinjam */}
          <div>
            <button
              onClick={() => setShowBorrowForm(!showBorrowForm)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {showBorrowForm ? "Batal" : "Pinjam Buku"}
            </button>
          </div>

          {/* Form Pinjam */}
          {showBorrowForm && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal Pinjam
                </label>
                <input
                  type="date"
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal Jatuh Tempo
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Catatan
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  rows={3}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Konfirmasi Pinjam
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
