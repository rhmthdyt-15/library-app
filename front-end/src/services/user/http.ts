import HTTPClient from "../../lib/http";
import { wrapTokenAsHeader } from "../../common/helpers/http";
import apiConfig from "../../config/api";
import { User, PaginatedResponse } from "./interface";

const httpClient = HTTPClient(apiConfig.service.main);

export const getUsersService = (
  token: string,
  queryParams?: {
    search?: string;
    page?: number;
    per_page?: number;
  }
): Promise<PaginatedResponse<User>> => {
  const query = new URLSearchParams(queryParams as any).toString();
  return httpClient.getHttpRequest<PaginatedResponse<User>>(
    `/api/users${query ? `?${query}` : ""}`,
    { headers: wrapTokenAsHeader(token) }
  );
};

export const getUserDetailService = (
  token: string,
  id: number
): Promise<User> =>
  httpClient.getHttpRequest<User>(`/api/users/${id}`, {
    headers: wrapTokenAsHeader(token),
  });

export const createUserService = (
  token: string,
  payload: Partial<User> & { password: string }
): Promise<User> =>
  httpClient.postHttpRequest<User>("/api/users", payload, {
    headers: wrapTokenAsHeader(token),
  });

export const updateUserService = (
  token: string,
  id: number,
  payload: Partial<User> & { password?: string }
): Promise<User> =>
  httpClient.putHttpRequest<User>(`/api/users/${id}`, payload, {
    headers: wrapTokenAsHeader(token),
  });

export const deleteUserService = (
  token: string,
  id: number
): Promise<{ message: string }> =>
  httpClient.deleteHttpRequest<{ message: string }>(`/api/users/${id}`, {
    headers: wrapTokenAsHeader(token),
  });
