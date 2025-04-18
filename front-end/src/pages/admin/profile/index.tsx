import { useState, useEffect } from "react";

import AdminLayout from "../../../components/layouts/AdminLayout";
import {
  AuthChangePasswordRequestBody,
  AuthUpdateProfileRequestBody,
} from "../../../services/auth/interface";
import { useProfile } from "./hooks";

const ProfilePage = () => {
  const {
    profile,
    isLoading,
    error,
    getProfile,
    updateProfile,
    changePassword,
  } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    address: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, []); // Hapus dependency getProfile

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(null);

    // Jika ada perubahan profile (nama, nomor telepon, alamat)
    const profileData: AuthUpdateProfileRequestBody = {};

    if (formData.name !== profile?.name) {
      profileData.name = formData.name;
    }

    if (formData.phone_number !== profile?.phone_number) {
      profileData.phone_number = formData.phone_number;
    }

    if (formData.address !== profile?.address) {
      profileData.address = formData.address;
    }

    // Update profile jika ada perubahan
    if (Object.keys(profileData).length > 0) {
      const success = await updateProfile(profileData);
      if (success) {
        setUpdateSuccess("Profil berhasil diperbarui");
      }
    }

    // Jika ada perubahan password
    if (formData.password) {
      if (formData.password !== formData.password_confirmation) {
        alert("Password baru dan konfirmasi password tidak cocok");
        return;
      }

      if (!formData.current_password) {
        alert("Masukkan password saat ini untuk melakukan perubahan");
        return;
      }

      const passwordData: AuthChangePasswordRequestBody = {
        current_password: formData.current_password,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const success = await changePassword(passwordData);
      if (success) {
        setUpdateSuccess("Password berhasil diperbarui");
        // Reset password fields
        setFormData((prev) => ({
          ...prev,
          current_password: "",
          password: "",
          password_confirmation: "",
        }));
      }
    }

    setIsEditing(false);
  };

  if (isLoading && !profile) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
            <p className="text-center text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded mb-4">{error}</div>
        )}

        {updateSuccess && (
          <div className="bg-green-50 text-green-700 p-4 rounded mb-4">
            {updateSuccess}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold">
                {profile?.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium">{profile?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Nomor Telepon</p>
                <p className="font-medium">{profile?.phone_number || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Alamat</p>
                <p className="font-medium">{profile?.address || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{profile?.role}</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile?.email}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Email tidak dapat diubah
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Ubah Password</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
