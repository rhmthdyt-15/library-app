import { format } from "date-fns";
import { Borrowing } from "../../../../services/borrowings/interface";

interface BorrowingsTableProps {
  borrowings: Borrowing[];
  onViewDetail: (borrowingId: number) => void;
  onReturnBook: (borrowingId: number) => void;
}

const BorrowingsTable = ({
  borrowings,
  onViewDetail,
  onReturnBook,
}: BorrowingsTableProps) => {
  // Function to determine which status badge color to show
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "dipinjam":
        return "bg-blue-100 text-blue-800";
      case "dikembalikan":
        return "bg-green-100 text-green-800";
      case "terlambat":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border text-left">ID</th>
            <th className="py-2 px-4 border text-left">User Name</th>
            <th className="py-2 px-4 border text-left w-[25%]">Book Title</th>
            <th className="py-2 px-4 border text-left">Borrow Date</th>
            <th className="py-2 px-4 border text-left">Due Date</th>
            <th className="py-2 px-4 border text-left">Return Date</th>
            <th className="py-2 px-4 border text-left">Status</th>
            <th className="py-2 px-4 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowings.length ? (
            borrowings.map((borrowing) => (
              <tr key={borrowing.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{borrowing.id}</td>
                <td className="py-2 px-4 border">{borrowing.user?.name}</td>
                <td className="py-2 px-4 border">{borrowing.book?.title}</td>
                <td className="py-2 px-4 border">
                  {format(new Date(borrowing.borrow_date), "yyyy-MM-dd")}
                </td>
                <td className="py-2 px-4 border">
                  {format(new Date(borrowing.due_date), "yyyy-MM-dd")}
                </td>
                <td className="py-2 px-4 border">
                  {borrowing.return_date
                    ? format(new Date(borrowing.return_date), "yyyy-MM-dd")
                    : "-"}
                </td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(
                      borrowing.status
                    )}`}
                  >
                    {borrowing.status}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      onClick={() => onViewDetail(borrowing.id)}
                    >
                      View
                    </button>
                    {borrowing.status === "dipinjam" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => onReturnBook(borrowing.id)}
                      >
                        Return
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-4 text-center">
                No borrowings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowingsTable;
