// src/components/dashboard/StatsCards.tsx
import React from "react";

interface StatsCardsProps {
  stats: {
    total_books: number;
    available_books: number;
    total_users: number;
    active_borrowings: number;
    overdue_borrowings: number;
    borrowings_today: number;
    returns_today: number;
    borrowings_this_month: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Total Buku</h3>
        <p className="text-3xl font-bold">{stats.total_books}</p>
        <p className="text-sm text-gray-500 mt-2">
          {stats.available_books} buku tersedia
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-green-700 mb-2">
          Anggota Aktif
        </h3>
        <p className="text-3xl font-bold">{stats.total_users}</p>
        <p className="text-sm text-gray-500 mt-2">Total anggota terdaftar</p>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-yellow-700 mb-2">
          Peminjaman
        </h3>
        <p className="text-3xl font-bold">{stats.active_borrowings}</p>
        <p className="text-sm text-gray-500 mt-2">
          {stats.overdue_borrowings} peminjaman terlambat
        </p>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">
          Peminjaman Hari Ini
        </h3>
        <p className="text-3xl font-bold">{stats.borrowings_today}</p>
        <p className="text-sm text-gray-500 mt-2">Buku dipinjam hari ini</p>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-indigo-700 mb-2">
          Pengembalian Hari Ini
        </h3>
        <p className="text-3xl font-bold">{stats.returns_today}</p>
        <p className="text-sm text-gray-500 mt-2">Buku dikembalikan hari ini</p>
      </div>

      <div className="bg-pink-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-pink-700 mb-2">
          Peminjaman Bulan Ini
        </h3>
        <p className="text-3xl font-bold">{stats.borrowings_this_month}</p>
        <p className="text-sm text-gray-500 mt-2">Total bulan ini</p>
      </div>
    </div>
  );
};
