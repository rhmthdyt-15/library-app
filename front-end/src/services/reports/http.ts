// src/services/reports.ts
import { wrapTokenAsHeader } from "../../common/helpers/http";
import apiConfig from "../../config/api";

import HTTPClient from "../../lib/http";
import {
  DashboardResponse,
  BorrowingsReportResponse,
  UsersReportResponse,
  BooksReportResponse,
  Category,
} from "./interface";

const httpClient = HTTPClient(apiConfig.service.main);

export const getDashboardReportService = (
  token: string
): Promise<DashboardResponse> =>
  httpClient.getHttpRequest<DashboardResponse>("/api/reports/dashboard", {
    headers: wrapTokenAsHeader(token),
  });

export const getBorrowingsReportService = (
  token: string,
  startDate: string,
  endDate: string
): Promise<BorrowingsReportResponse> =>
  httpClient.getHttpRequest<BorrowingsReportResponse>(
    `/api/reports/borrowings?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: wrapTokenAsHeader(token),
    }
  );

export const getUsersReportService = (
  token: string
): Promise<UsersReportResponse> =>
  httpClient.getHttpRequest<UsersReportResponse>("/api/reports/users", {
    headers: wrapTokenAsHeader(token),
  });

export const getBooksReportService = (
  token: string,
  categoryId?: number
): Promise<BooksReportResponse> =>
  httpClient.getHttpRequest<BooksReportResponse>(
    `/api/reports/books${categoryId ? `?category_id=${categoryId}` : ""}`,
    {
      headers: wrapTokenAsHeader(token),
    }
  );

export const getCategoriesService = (token: string): Promise<Category[]> =>
  httpClient.getHttpRequest<Category[]>("/api/categories", {
    headers: wrapTokenAsHeader(token),
  });
