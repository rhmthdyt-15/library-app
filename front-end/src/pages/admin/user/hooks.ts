import { useState } from "react";
import {
  getUsersService,
  getUserDetailService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../../../services/user/http";

import {
  UserPaginateResponse,
  UserCreateRequest,
  UserUpdateRequest,
} from "../../../services/user/interface";

import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";

export const useUser = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState<UserPaginateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (params?: {
    page?: number;
    search?: string;
    per_page?: number;
  }) => {
    if (!token) {
      toast.error("Unauthorized: No token found");
      return;
    }

    try {
      setLoading(true);
      const response = await getUsersService(token, params);
      setUsers(response);
    } catch (err: any) {
      const message = err.message || "Failed to fetch users";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetail = async (id: number) => {
    if (!token) {
      toast.error("Unauthorized");
      return null;
    }

    try {
      const user = await getUserDetailService(token, id);
      return user;
    } catch (err: any) {
      const message = err.message || "Failed to get user detail";
      toast.error(message);
      throw new Error(message);
    }
  };

  const createUser = async (data: UserCreateRequest) => {
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const response = await createUserService(token, data);
      toast.success("User created successfully");
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to create user";
      toast.error(message);
      throw new Error(message);
    }
  };

  const updateUser = async (id: number, data: UserUpdateRequest) => {
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const response = await updateUserService(token, id, data);
      toast.success("User updated successfully");
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to update user";
      toast.error(message);
      throw new Error(message);
    }
  };

  const deleteUser = async (id: number) => {
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const response = await deleteUserService(token, id);
      toast.success("User deleted successfully");
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to delete user";
      toast.error(message);
      throw new Error(message);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserDetail,
    createUser,
    updateUser,
    deleteUser,
  };
};
