import { format } from "date-fns";
import { Borrowing } from "../../../../services/borrowings/interface";
import { useBorrowing } from "../hooks";

interface BorrowingDetailModalProps {
  borrowing: Borrowing;
  onClose: () => void;
  onReturnSuccess: () => void;
}

const BorrowingDetailModal = ({
  borrowing,
  onClose,
  onReturnSuccess,
}: BorrowingDetailModalProps) => {
  const { returnBook, loading } = useBorrowing();

  const handleReturn = async () => {
    if (window.confirm("Are you sure you want to return this book?")) {
      const result = await returnBook(borrowing.id);
      if (result) {
        onReturnSuccess();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Borrowing Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Book Information</h3>
            <p>
              <strong>Title:</strong> {borrowing.book?.title}
            </p>
            <p>
              <strong>Author:</strong> {borrowing.book?.author}
            </p>
            <p>
              <strong>ISBN:</strong> {borrowing.book?.isbn}
            </p>
            <p>
              <strong>Publisher:</strong> {borrowing.book?.publisher}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">User Information</h3>
            <p>
              <strong>Name:</strong> {borrowing.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {borrowing.user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {borrowing.user?.phone_number}
            </p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Borrowing Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Borrowing ID:</strong> {borrowing.id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  borrowing.status === "dipinjam"
                    ? "bg-blue-100 text-blue-800"
                    : borrowing.status === "dikembalikan"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {borrowing.status}
              </span>
            </p>
            <p>
              <strong>Borrow Date:</strong>{" "}
              {format(new Date(borrowing.borrow_date), "yyyy-MM-dd")}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {format(new Date(borrowing.due_date), "yyyy-MM-dd")}
            </p>
            <p>
              <strong>Return Date:</strong>{" "}
              {borrowing.return_date
                ? format(new Date(borrowing.return_date), "yyyy-MM-dd")
                : "-"}
            </p>
          </div>
        </div>
        {borrowing.notes && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="bg-gray-50 p-3 rounded">{borrowing.notes}</p>
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
          {borrowing.status === "dipinjam" && (
            <button
              onClick={handleReturn}
              className="px-4 py-2 bg-green-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Processing..." : "Return Book"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowingDetailModal;
