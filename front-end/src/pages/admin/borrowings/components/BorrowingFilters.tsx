interface BorrowingFiltersProps {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const BorrowingFilters = ({
  handleSearchChange,
  status,
  onStatusChange,
}: BorrowingFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <input
        type="text"
        placeholder="Search by name"
        className="border rounded px-4 py-2 w-full md:w-1/3"
        onChange={handleSearchChange}
      />

      <div className="w-48">
        <select
          className="w-full px-4 py-2 border rounded"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="dipinjam">Borrowed</option>
          <option value="dikembalikan">Returned</option>
          <option value="terlambat">Overdue</option>
        </select>
      </div>
    </div>
  );
};

export default BorrowingFilters;
