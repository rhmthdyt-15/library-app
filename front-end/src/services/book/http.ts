import { wrapTokenAsHeader } from "../../common/helpers/http";
import apiConfig from "../../config/api";
import HTTPClient from "../../lib/http";
import {
  Book,
  BookResponse,
  BookPaginateResponse,
  DashboardSummary,
  BorrowedBook,
} from "./interface";

const httpClient = HTTPClient(apiConfig.service.main);

export const getBooksService = (
  token: string,
  queryParams?: {
    title?: string;
    author?: string;
    category_id?: number;
    page?: number;
  }
): Promise<BookPaginateResponse> => {
  const query = new URLSearchParams(queryParams as any).toString();
  return httpClient.getHttpRequest<BookPaginateResponse>(
    `/api/books${query ? `?${query}` : ""}`,
    { headers: wrapTokenAsHeader(token) }
  );
};

export const getBookDetailService = (
  token: string,
  id: number
): Promise<Book> =>
  httpClient.getHttpRequest<Book>(`/api/books/${id}`, {
    headers: wrapTokenAsHeader(token),
  });

export const createBookService = (
  token: string,
  formData: FormData
): Promise<BookResponse> =>
  httpClient.postHttpRequest<BookResponse>("/api/books", formData, {
    headers: {
      ...wrapTokenAsHeader(token),
      "Content-Type": "multipart/form-data",
    },
  });

export const updateBookService = (
  token: string,
  id: number,
  formData: FormData
): Promise<BookResponse> =>
  httpClient.putHttpRequest<BookResponse>(`/api/books/${id}`, formData, {
    headers: {
      ...wrapTokenAsHeader(token),
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteBookService = (
  token: string,
  id: number
): Promise<{ message: string }> =>
  httpClient.deleteHttpRequest<{ message: string }>(`/api/books/${id}`, {
    headers: wrapTokenAsHeader(token),
  });

export const getDashboardSummaryService = (
  token: string
): Promise<DashboardSummary> => {
  return httpClient.getHttpRequest("/api/dashboard/summary", {
    headers: wrapTokenAsHeader(token),
  });
};

export const getCurrentBorrowingsService = (
  token: string
): Promise<BorrowedBook[]> => {
  return httpClient.getHttpRequest("/api/dashboard/current-borrowings", {
    headers: wrapTokenAsHeader(token),
  });
};

export const getBookRecommendationsService = (
  token: string
): Promise<Book[]> => {
  return httpClient.getHttpRequest("/api/dashboard/recommendations", {
    headers: wrapTokenAsHeader(token),
  });
};
