import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path ? "bg-primary-light" : "";

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary text-white">
          <div className="p-6">
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
            <p className="text-sm opacity-75">Perpustakaan Digital</p>
          </div>

          <nav className="mt-6">
            <ul>
              <li>
                <Link
                  to="/admin"
                  className={`block py-3 px-6 hover:bg-primary-light ${isActive(
                    "/admin"
                  )}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/categories"
                  className={`block py-3 px-6 hover:bg-primary-light ${isActive(
                    "/admin/categories"
                  )}`}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/books"
                  className={`block py-3 px-6 hover:bg-primary-light ${isActive(
                    "/admin/books"
                  )}`}
                >
                  Kelola Buku
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className={`block py-3 px-6 hover:bg-primary-light ${isActive(
                    "/admin/users"
                  )}`}
                >
                  Kelola Anggota
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/borrowings"
                  className={`block py-3 px-6 hover:bg-primary-light ${isActive(
                    "/admin/borrowings"
                  )}`}
                >
                  Peminjaman
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/profile"
                  className={`block py-3 px-6 hover:bg-primary-light ${isActive(
                    "/admin/profile"
                  )}`}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white shadow">
            <div className="py-4 px-6 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
