import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardData } from "./hooks";
import { getBorrowingsReportService } from "../../services/reports/http";
import { Borrowing } from "../../services/reports/interface";
import { StatsCards } from "./profile/components/StatsCards";
import { PopularBooks } from "./profile/components/PopularBooks";
import { RecentBooks } from "./profile/components/RecentBooks";
import { RecentBorrowings } from "./profile/components/RecentBorrowings";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const { dashboardData, loading, error } = useDashboardData();

  const [recentBorrowings, setRecentBorrowings] = useState<Borrowing[]>([]);
  const [borrowingsLoading, setBorrowingsLoading] = useState(true);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });

  const fetchRecentBorrowings = async () => {
    if (!token) return;

    try {
      setBorrowingsLoading(true);
      const data = await getBorrowingsReportService(token, startDate, endDate);
      setRecentBorrowings(data.borrowings);
    } catch (err) {
      console.error("Error fetching recent borrowings:", err);
    } finally {
      setBorrowingsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentBorrowings();
  }, [token, startDate, endDate]);

  if (loading && !dashboardData) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          <p>Error: {error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Selamat datang, {user?.name}!
        </h2>
        <p className="text-gray-600 mb-6">
          Ini adalah panel admin untuk mengelola Perpustakaan Digital.
        </p>

        {dashboardData && <StatsCards stats={dashboardData.stats} />}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {dashboardData && (
            <PopularBooks books={dashboardData.popular_books.slice(0, 5)} />
          )}
          {dashboardData && (
            <RecentBooks books={dashboardData.recent_books.slice(0, 5)} />
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Aktivitas Peminjaman Terbaru
          </h3>

          {/* ✅ Filter Tanggal */}
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={fetchRecentBorrowings}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Filter
            </button>
          </div>

          <RecentBorrowings
            borrowings={recentBorrowings}
            loading={borrowingsLoading}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
