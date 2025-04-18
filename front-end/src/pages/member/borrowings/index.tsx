import React, { useEffect, useState } from "react";
import MemberLayout from "../../../components/layouts/MemberLayout";
import { useBorrowing } from "./hooks";
import { ToastContainer } from "react-toastify";

const BorrowingMemberPage: React.FC = () => {
  const { borrowings, fetchBorrowings, loading, error, extendBorrowing } =
    useBorrowing();

  const [selectedBorrowingId, setSelectedBorrowingId] = useState<number | null>(
    null
  );
  const [newDueDate, setNewDueDate] = useState<string>("");
  const [minDate, setMinDate] = useState<string>("");

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleExtend = async () => {
    if (!selectedBorrowingId || !newDueDate) return;
    await extendBorrowing(selectedBorrowingId, { new_due_date: newDueDate });
    setSelectedBorrowingId(null);
    setNewDueDate("");
    setMinDate("");
    fetchBorrowings(); // refresh data
  };

  return (
    <MemberLayout>
      <div className="bg-white rounded-lg shadow">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Riwayat Buku</h1>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && borrowings?.data?.length === 0 && (
            <p>Tidak ada riwayat peminjaman.</p>
          )}

          {!loading && borrowings?.data && borrowings.data.length > 0 && (
            <ul className="space-y-4">
              {borrowings.data.map((item) => (
                <li
                  key={item.id}
                  className="border p-4 rounded shadow-sm hover:bg-gray-50"
                >
                  <div className="font-semibold text-lg">
                    {item.book?.title || "Judul tidak tersedia"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Dipinjam pada:{" "}
                    {new Date(item.borrow_date).toLocaleDateString("id-ID")}
                  </div>

                  <div className="text-sm text-gray-600">
                    Dikembalikan pada:{" "}
                    {item.return_date
                      ? new Date(item.return_date).toLocaleDateString("id-ID")
                      : "Belum dikembalikan"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status:{" "}
                    <span className="font-medium capitalize">
                      {item.status}
                    </span>
                  </div>

                  {item.status === "dipinjam" && (
                    <button
                      onClick={() => {
                        setSelectedBorrowingId(item.id);

                        // hitung tanggal minimal baru
                        const dueDate = new Date(item.due_date);
                        const nextDate = new Date(dueDate);
                        nextDate.setDate(dueDate.getDate() + 1);

                        const nextDateStr = nextDate
                          .toISOString()
                          .split("T")[0];
                        setNewDueDate(nextDateStr);
                        setMinDate(nextDateStr);
                      }}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Perpanjang
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal sederhana */}
      {selectedBorrowingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Perpanjang Peminjaman
            </h2>

            <label className="block mb-2 text-sm font-medium">
              Tanggal Baru
            </label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded mb-4"
              value={newDueDate}
              min={minDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedBorrowingId(null);
                  setNewDueDate("");
                  setMinDate("");
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleExtend}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
};

export default BorrowingMemberPage;
