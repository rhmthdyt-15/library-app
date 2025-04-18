import { useEffect, useState } from "react";
import MemberLayout from "../../components/layouts/MemberLayout";
import { useAuth } from "../../hooks/useAuth";
import {
  getDashboardSummaryService,
  getCurrentBorrowingsService,
  getBookRecommendationsService,
} from "../../services/book/http";
import {
  BorrowedBook,
  Book,
  DashboardSummary,
} from "../../services/book/interface";
import { getImageUrl } from "../../utils/url";

const MemberDashboard = () => {
  const { token, user } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      Promise.all([
        getDashboardSummaryService(token),
        getCurrentBorrowingsService(token),
        getBookRecommendationsService(token),
      ])
        .then(([summaryRes, borrowingsRes, recommendationsRes]) => {
          setSummary(summaryRes);
          setBorrowedBooks(borrowingsRes || []);
          setRecommendations(recommendationsRes || []);
        })
        .catch((err) => console.error("Dashboard error:", err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading || !summary) {
    return (
      <MemberLayout>
        <p>Loading...</p>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Selamat datang, {user?.name}!
        </h2>
        <p className="text-gray-600 mb-6">
          Selamat datang di Perpustakaan Digital. Di sini Anda dapat menjelajahi
          katalog buku dan mengelola peminjaman.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm font-semibold text-blue-700 mb-1">
              Buku Dipinjam
            </h3>
            <p className="text-2xl font-bold text-blue-900">
              {summary.borrowed_count}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm font-semibold text-purple-700 mb-1">
              Riwayat Peminjaman
            </h3>
            <p className="text-2xl font-bold text-purple-900">
              {summary.total_history}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm font-semibold text-red-700 mb-1">
              Buku Hampir Jatuh Tempo
            </h3>
            <p className="text-2xl font-bold text-red-900">
              {summary.overdue_soon}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Buku yang Sedang Dipinjam
          </h3>
          <div className="bg-gray-50 rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {borrowedBooks.length > 0 ? (
                borrowedBooks.map((book, index) => (
                  <li
                    key={`borrowed-${index}`}
                    className="p-4 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {book.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dipinjam: {book.borrowed_at}
                      </p>
                      <p className="text-sm text-gray-500">
                        Jatuh tempo: {book.due_date}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-4 text-gray-500">
                  Belum ada buku yang sedang dipinjam.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Rekomendasi Buku</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.length > 0 ? (
              recommendations.map((book, index) => (
                <div
                  key={`recommendation-${index}`}
                  className="bg-white rounded shadow overflow-hidden hover:shadow-md transition-shadow"
                >
                  {book.cover_image ? (
                    <img
                      src={getImageUrl(book.cover_image)}
                      alt={book.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      Tidak ada gambar
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-base mb-1">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                Tidak ada rekomendasi buku.
              </p>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default MemberDashboard;
