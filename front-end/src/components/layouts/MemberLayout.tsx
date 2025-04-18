// src/components/layouts/MemberLayout.tsx
import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface MemberLayoutProps {
  children: ReactNode;
}

const MemberLayout = ({ children }: MemberLayoutProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary">
                  Perpustakaan Digital
                </h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link
                  to="/member"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/member") && location.pathname === "/member"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/member/katalog-buku"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/member/katalog-buku")
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  Katalog Buku
                </Link>
                <Link
                  to="/member/borrowed"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/member/borrowed")
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  Buku Dipinjam
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Halo, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-light transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Perpustakaan Digital. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MemberLayout;
