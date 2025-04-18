// src/components/dashboard/RecentBorrowings.tsx
import React from "react";
import { Borrowing } from "../../../../services/reports/interface";

interface RecentBorrowingsProps {
  borrowings: Borrowing[];
  loading: boolean;
}

export const RecentBorrowings: React.FC<RecentBorrowingsProps> = ({
  borrowings,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg shadow p-4">
        <p className="text-gray-500 text-center py-4">Loading aktivitas...</p>
      </div>
    );
  }

  if (borrowings.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg shadow p-4">
        <p className="text-gray-500 text-center py-4">
          Tidak ada aktivitas peminjaman dalam 7 hari terakhir.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else {
      return `${diffDays} hari yang lalu`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "dipinjam":
        return (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            Dipinjam
          </span>
        );
      case "dikembalikan":
        return (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Dikembalikan
          </span>
        );
      case "terlambat":
        return (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
            Terlambat
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow">
      <ul className="divide-y divide-gray-200">
        {borrowings.map((borrowing) => (
          <li key={borrowing.id} className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-800">
                  <span className="font-semibold">{borrowing.user.name}</span>{" "}
                  {borrowing.status === "dikembalikan"
                    ? "mengembalikan"
                    : "meminjam"}{" "}
                  buku{" "}
                  <span className="font-medium">"{borrowing.book.title}"</span>
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(
                    borrowing.status === "dikembalikan"
                      ? borrowing.return_date!
                      : borrowing.borrow_date
                  )}
                </p>
              </div>
              <div>{getStatusBadge(borrowing.status)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
