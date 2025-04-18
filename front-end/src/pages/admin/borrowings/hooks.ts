import { useState } from "react";
import {
  getBorrowingsService,
  getBorrowingDetailService,
  createBorrowingWithAdminService,
  returnBookService,
  checkOverdueService,
} from "../../../services/borrowings/http";
import {
  Borrowing,
  BorrowingCreateWithAdminRequest,
  BorrowingPaginateResponse,
} from "../../../services/borrowings/interface";

import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";

export const useBorrowing = () => {
  const { token } = useAuth();
  const [borrowings, setBorrowings] =
    useState<BorrowingPaginateResponse | null>(null);
  const [currentBorrowing, setCurrentBorrowing] = useState<Borrowing | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrowings = async (params?: {
    status?: string;
    user_id?: number;
    page?: number;
    search?: string; // Tambahkan parameter search
  }) => {
    if (!token) {
      toast.error("Unauthorized: No token found");
      return;
    }

    try {
      setLoading(true);
      const response = await getBorrowingsService(token, params);
      setBorrowings(response);
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to fetch borrowings";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getBorrowingDetail = async (id: number) => {
    if (!token) {
      toast.error("Unauthorized");
      return null;
    }

    try {
      setLoading(true);
      const borrowing = await getBorrowingDetailService(token, id);
      setCurrentBorrowing(borrowing);
      return borrowing;
    } catch (err: any) {
      const message = err.message || "Failed to get borrowing detail";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createBorrowingWithAdmin = async (
    data: BorrowingCreateWithAdminRequest
  ) => {
    if (!token) {
      toast.error("Unauthorized");
      return null;
    }

    try {
      setLoading(true);
      const response = await createBorrowingWithAdminService(token, data);
      toast.success(response.message);
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to create borrowing";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (borrowingId: number) => {
    if (!token) {
      toast.error("Unauthorized");
      return null;
    }

    try {
      setLoading(true);
      const response = await returnBookService(token, borrowingId);
      toast.success(response.message);
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to return book";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkOverdue = async () => {
    if (!token) {
      toast.error("Unauthorized");
      return null;
    }

    try {
      setLoading(true);
      const response = await checkOverdueService(token);
      toast.success(response.message);
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to check overdue";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    borrowings,
    currentBorrowing,
    loading,
    error,
    fetchBorrowings,
    getBorrowingDetail,
    createBorrowingWithAdmin,
    returnBook,
    checkOverdue,
  };
};
