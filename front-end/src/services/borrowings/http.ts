// src/services/borrowing/http.ts

import HTTPClient from "../../lib/http";
import { wrapTokenAsHeader } from "../../common/helpers/http";
import apiConfig from "../../config/api";
import {
  Borrowing,
  BorrowingCreateRequest,
  BorrowingCreateWithAdminRequest,
  BorrowingExtendRequest,
  BorrowingPaginateResponse,
  BorrowingResponse,
  OverdueCheckResponse,
} from "./interface";

const httpClient = HTTPClient(apiConfig.service.main);

export const getBorrowingsService = (
  token: string,
  queryParams?: {
    status?: string;
    user_id?: number;
    page?: number;
    search?: string;
  }
): Promise<BorrowingPaginateResponse> => {
  const query = new URLSearchParams(queryParams as any).toString();
  return httpClient.getHttpRequest<BorrowingPaginateResponse>(
    `/api/borrowings${query ? `?${query}` : ""}`,
    { headers: wrapTokenAsHeader(token) }
  );
};

export const getBorrowingDetailService = (
  token: string,
  id: number
): Promise<Borrowing> =>
  httpClient.getHttpRequest<Borrowing>(`/api/borrowings/${id}`, {
    headers: wrapTokenAsHeader(token),
  });

export const createBorrowingService = (
  token: string,
  payload: BorrowingCreateRequest
): Promise<BorrowingResponse> =>
  httpClient.postHttpRequest<BorrowingResponse>("/api/borrowings", payload, {
    headers: wrapTokenAsHeader(token),
  });

export const createBorrowingWithAdminService = (
  token: string,
  payload: BorrowingCreateWithAdminRequest
): Promise<BorrowingResponse> =>
  httpClient.postHttpRequest<BorrowingResponse>(
    "/api/borrowings-with-admin",
    payload,
    {
      headers: wrapTokenAsHeader(token),
    }
  );

export const returnBookService = (
  token: string,
  borrowingId: number
): Promise<BorrowingResponse> =>
  httpClient.postHttpRequest<BorrowingResponse>(
    `/api/borrowings/${borrowingId}/return`,
    {},
    {
      headers: wrapTokenAsHeader(token),
    }
  );

export const extendBorrowingService = (
  token: string,
  borrowingId: number,
  payload: BorrowingExtendRequest
): Promise<BorrowingResponse> =>
  httpClient.postHttpRequest<BorrowingResponse>(
    `/api/borrowings/${borrowingId}/extend`,
    payload,
    {
      headers: wrapTokenAsHeader(token),
    }
  );

export const checkOverdueService = (
  token: string
): Promise<OverdueCheckResponse> =>
  httpClient.getHttpRequest<OverdueCheckResponse>(`/api/check-overdue`, {
    headers: wrapTokenAsHeader(token),
  });
