// src/hooks/useBorrowing.ts

import { useState } from "react";
import {
  getBorrowingsService,
  getBorrowingDetailService,
  createBorrowingService,
  extendBorrowingService,
} from "../../../services/borrowings/http";
import {
  Borrowing,
  BorrowingCreateRequest,
  BorrowingExtendRequest,
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

  const createBorrowing = async (data: BorrowingCreateRequest) => {
    if (!token) {
      toast.error("Unauthorized");
      return null;
    }

    try {
      setLoading(true);
      const response = await createBorrowingService(token, data);
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

  const extendBorrowing = async (
    borrowingId: number,
    data: BorrowingExtendRequest
  ) => {
    if (!token) {
      toast.error("Unauthorized");
      return null;
    }

    try {
      setLoading(true);
      const response = await extendBorrowingService(token, borrowingId, data);
      toast.success(response.message);
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to extend borrowing";
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
    createBorrowing,
    extendBorrowing,
  };
};
