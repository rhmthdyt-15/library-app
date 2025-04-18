// src/hooks/useBook.ts
import { useState, useEffect } from "react";

import { useAuth } from "../../../hooks/useAuth";
import { Book } from "../../../services/book/interface";
import {
  getBookDetailService,
  getBooksService,
} from "../../../services/book/http";
import { Category } from "../../../services/category/interface";
import { getCategoriesService } from "../../../services/category/http";

// Hook untuk daftar buku dengan filter
export const useBooks = (filters?: {
  title?: string;
  author?: string;
  category_id?: number;
  page?: number;
}) => {
  const { token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });

  useEffect(() => {
    if (!token) return;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Menggunakan parameter query yang diterima langsung dari props
        const response = await getBooksService(token, filters);
        setBooks(response.data);
        setPagination({
          currentPage: response.current_page,
          totalPages: response.last_page,
          totalItems: response.total,
          perPage: response.per_page,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Gagal mengambil data buku");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token, JSON.stringify(filters)]);

  // Tambahan fungsi untuk mengupdate filter dan halaman
  const [currentFilters, setCurrentFilters] = useState(filters || {});

  const updateFilters = (newFilters: {
    title?: string;
    author?: string;
    category_id?: number;
  }) => {
    // Reset halaman ke 1
    setCurrentFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  return {
    books,
    loading,
    error,
    pagination,
    filters: currentFilters,
    updateFilters,
    handlePageChange,
  };
};

export const useBookDetail = (bookId?: number) => {
  const { token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookDetail = async (id: number) => {
    if (!token || !id) return;

    setLoading(true);
    try {
      const response = await getBookDetailService(token, id);
      setBook(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Gagal mengambil detail buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchBookDetail(bookId);
    }
  }, [token, bookId]);

  return {
    book,
    loading,
    error,
    refreshBookDetail: (id: number) => fetchBookDetail(id),
  };
};

export const useCategories = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getCategoriesService(token);
      setCategories(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Gagal mengambil data kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  return {
    categories,
    loading,
    error,
    refreshCategories: fetchCategories,
  };
};
