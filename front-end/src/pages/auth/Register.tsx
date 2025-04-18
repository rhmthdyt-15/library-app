import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/input";

const Register = () => {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validasi
    if (password !== confirmPassword) {
      setValidationError("Password dan konfirmasi password tidak cocok");
      return;
    }

    try {
      await register({
        name: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
        phone_number: phoneNumber,
        address,
      });

      // Langsung redirect ke login tanpa memeriksa user
      navigate("/login");
    } catch (error) {
      console.log(error);
      // Error sudah ditangani oleh context
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="form-container">
        <h2 className="form-title">Daftar Akun</h2>
        <p className="form-subtitle">Perpustakaan Digital</p>

        {(error || validationError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Lengkap"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Nomor Telepon"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <Input
            label="Alamat"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Daftar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Atau</p>
          <p className="mt-2 text-sm">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
