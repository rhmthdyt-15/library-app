import { useEffect, useState } from "react";

import {
  Book,
  BookPaginateResponse,
  BookResponse,
} from "../../../services/book/interface";

import {
  getBooksService,
  getBookDetailService,
  createBookService,
  updateBookService,
  deleteBookService,
} from "../../../services/book/http";
import { useAuth } from "../../../hooks/useAuth";

// ✅ List / Filter Books
export const useBooks = (filters?: {
  title?: string;
  author?: string;
  category_id?: number;
  page?: number;
}) => {
  const { token } = useAuth();
  const [books, setBooks] = useState<BookPaginateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await getBooksService(token, filters);
        setBooks(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token, JSON.stringify(filters)]);

  return { books, loading, error };
};

// ✅ Get Book Detail
export const useBookDetail = (bookId?: number) => {
  const { token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !bookId) return;

    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await getBookDetailService(token, bookId);
        setBook(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching book detail:", err);
        setError("Failed to fetch book detail");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [token, bookId]);

  return { book, loading, error };
};

// ✅ Create Book
export const useCreateBook = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<BookResponse | null>(null);

  const createBook = async (formData: FormData) => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await createBookService(token, formData);
      setResponse(res);
      setError(null);
    } catch (err) {
      console.error("Error creating book:", err);
      setError("Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  return { createBook, loading, error, response };
};

// ✅ Update Book
export const useUpdateBook = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<BookResponse | null>(null);

  const updateBook = async (id: number, formData: FormData) => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await updateBookService(token, id, formData);
      setResponse(res);
      setError(null);
    } catch (err) {
      console.error("Error updating book:", err);
      setError("Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  return { updateBook, loading, error, response };
};

// ✅ Delete Book
export const useDeleteBook = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deleteBook = async (id: number) => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await deleteBookService(token, id);
      setSuccessMessage(res.message);
      setError(null);
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Failed to delete book");
    } finally {
      setLoading(false);
    }
  };

  return { deleteBook, loading, error, successMessage };
};
