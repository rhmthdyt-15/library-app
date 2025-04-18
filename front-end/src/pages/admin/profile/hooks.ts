import { useState, useCallback, useEffect } from "react";

import { useAuth } from "../../../hooks/useAuth";
import {
  getProfileService,
  updateProfileService,
  changePasswordService,
} from "../../../services/auth/http";
import {
  AuthUpdateProfileRequestBody,
  AuthChangePasswordRequestBody,
  User as ApiUser,
} from "../../../services/auth/interface";
import { User as UserType, UserRole } from "../../../types/user.types";

// Helper function: mapping from API user to App user
const mapApiUserToAppUser = (apiUser: ApiUser): UserType => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role as UserRole, // Convert string to enum
    phone_number: apiUser.phone_number,
    address: apiUser.address,
  };
};

interface UseProfileReturn {
  profile: UserType | null;
  isLoading: boolean;
  error: string | null;
  getProfile: () => Promise<void>;
  updateProfile: (data: AuthUpdateProfileRequestBody) => Promise<boolean>;
  changePassword: (data: AuthChangePasswordRequestBody) => Promise<boolean>;
}

export const useProfile = (): UseProfileReturn => {
  const { token, user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserType | null>(authUser || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    if (!token) {
      setError("Token tidak tersedia");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getProfileService(token);
      const appUser = mapApiUserToAppUser(response);
      setProfile(appUser);
      if (updateUser) {
        updateUser(appUser);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat profil");
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, updateUser]);

  const updateProfile = useCallback(
    async (data: AuthUpdateProfileRequestBody): Promise<boolean> => {
      if (!token) {
        setError("Token tidak tersedia");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await updateProfileService(token, data);
        const appUser = mapApiUserToAppUser(response.user);
        setProfile(appUser);
        if (updateUser) {
          updateUser(appUser);
        }
        return true;
      } catch (err: any) {
        setError(err.message || "Gagal mengupdate profil");
        console.error("Error updating profile:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [token, updateUser]
  );

  const changePassword = useCallback(
    async (data: AuthChangePasswordRequestBody): Promise<boolean> => {
      if (!token) {
        setError("Token tidak tersedia");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        await changePasswordService(token, data);
        return true;
      } catch (err: any) {
        setError(err.message || "Gagal mengubah password");
        console.error("Error changing password:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    profile,
    isLoading,
    error,
    getProfile,
    updateProfile,
    changePassword,
  };
};
