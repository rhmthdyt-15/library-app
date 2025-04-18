import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/input";

const Login = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password });

      // Redirect berdasarkan role
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/member");
      }
    } catch (error) {
      console.log(error);
      // Error sudah ditangani oleh context
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="form-container">
        <h2 className="form-title">Login Sistem</h2>
        <p className="form-subtitle">Perpustakaan Digital</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Masuk
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Atau</p>
          <p className="mt-2 text-sm">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
