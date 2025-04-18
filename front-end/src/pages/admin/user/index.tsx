import { useEffect, useState } from "react";
import { useUser } from "./hooks";
import { User, UserCreateRequest } from "../../../services/user/interface";
import { UserForm } from "./components/UserForm";
import AdminLayout from "../../../components/layouts/AdminLayout";
import { ToastContainer } from "react-toastify";

export const UserPage = () => {
  const { users, fetchUsers, createUser, updateUser, deleteUser, loading } =
    useUser();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers({ page: currentPage, search });
  }, [currentPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSubmit = async (data: UserCreateRequest) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, data);
    } else {
      await createUser(data);
    }
    setShowForm(false);
    setSelectedUser(null);
    fetchUsers({ page: currentPage, search });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await deleteUser(id);
      fetchUsers({ page: currentPage, search });
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowForm(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add New User
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border rounded px-4 py-2 w-full md:w-1/3"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {showForm && (
          <div className="mb-6">
            <UserForm
              initialData={selectedUser || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedUser(null);
              }}
            />
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.data.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border">{user.name}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.role}</td>
                    <td className="px-4 py-2 border">{user.phone_number}</td>
                    <td className="px-4 py-2 border">{user.address}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {users && users.last_page > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {users.current_page} of {users.last_page}
            </span>
            <button
              disabled={currentPage >= users.last_page}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
