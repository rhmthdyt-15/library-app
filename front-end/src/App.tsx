// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";

// Member Pages
import MemberDashboard from "./pages/member/Dashboard";
import ProfilePage from "./pages/admin/profile";
import BookPage from "./pages/admin/book";
import CategoryPage from "./pages/category";
import { UserPage } from "./pages/admin/user";
import { BorrowingPage } from "./pages/admin/borrowings";
import CatalogBookPage from "./pages/member/book";

// Protected Route Component
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "admin") {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/member" />;
    }
  }

  return children;
};

// Main App Component
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/member"} />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/member"} />
            ) : (
              <Register />
            )
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/borrowings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BorrowingPage />
            </ProtectedRoute>
          }
        />
        {/* Member Routes */}
        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={["member"]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/*"
          element={
            <ProtectedRoute allowedRoles={["member"]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/katalog-buku"
          element={
            <ProtectedRoute allowedRoles={["member"]}>
              <CatalogBookPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all and redirect */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                user ? (user.role === "admin" ? "/admin" : "/member") : "/login"
              }
            />
          }
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
