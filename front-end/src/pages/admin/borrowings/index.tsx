import { useEffect, useState } from "react";
import AdminLayout from "../../../components/layouts/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBorrowing } from "./hooks";
import { Borrowing } from "../../../services/borrowings/interface";
import BorrowingsTable from "./components/BorrowingsTable";

import CreateBorrowingModal from "./components/CreateBorrowingModal";
import BorrowingDetailModal from "./components/BorrowingDetailModal";
import BorrowingFilters from "./components/BorrowingFilters";
import Pagination from "./components/pagination";

export const BorrowingPage = () => {
  const {
    borrowings,
    loading,
    error,
    fetchBorrowings,
    checkOverdue,
    returnBook,
    getBorrowingDetail,
  } = useBorrowing();

  const [status, setStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [borrowingDetail, setBorrowingDetail] = useState<Borrowing | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchBorrowingsList = () => {
    const params: { status?: string; page: number; search?: string } = {
      page: currentPage,
    };
    if (status !== "") {
      params.status = status;
    }
    if (search !== "") {
      params.search = search;
    }
    fetchBorrowings(params);
  };

  useEffect(() => {
    fetchBorrowingsList();
  }, [status, currentPage, search]);

  const handleViewDetail = async (borrowingId: number) => {
    const detail = await getBorrowingDetail(borrowingId);
    if (detail) {
      setBorrowingDetail(detail);
      setShowDetailModal(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setSearch(searchValue);
      setCurrentPage(1);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleReturnBook = async (borrowingId: number) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      const result = await returnBook(borrowingId);
      if (result) {
        fetchBorrowingsList();
      }
    }
  };

  const handleCheckOverdue = async () => {
    const result = await checkOverdue();
    if (result) {
      fetchBorrowingsList();
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Borrowings</h1>
          <div className="flex space-x-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowCreateModal(true)}
            >
              Add Borrowing
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              onClick={handleCheckOverdue}
            >
              Check Overdue
            </button>
          </div>
        </div>

        <BorrowingFilters
          handleSearchChange={handleSearchChange}
          status={status}
          onStatusChange={handleStatusChange}
        />

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader">Loading...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-800 p-4 rounded">
            Error: {error}
          </div>
        ) : (
          <>
            <BorrowingsTable
              borrowings={borrowings?.data || []}
              onViewDetail={handleViewDetail}
              onReturnBook={handleReturnBook}
            />

            {borrowings && borrowings.last_page > 1 && (
              <Pagination
                links={borrowings.links}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {showCreateModal && (
        <CreateBorrowingModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchBorrowingsList();
          }}
        />
      )}

      {showDetailModal && borrowingDetail && (
        <BorrowingDetailModal
          borrowing={borrowingDetail}
          onClose={() => {
            setShowDetailModal(false);
            setBorrowingDetail(null);
          }}
          onReturnSuccess={() => {
            setShowDetailModal(false);
            setBorrowingDetail(null);
            fetchBorrowingsList();
          }}
        />
      )}
    </AdminLayout>
  );
};

export default BorrowingPage;
