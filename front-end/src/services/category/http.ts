import { wrapTokenAsHeader } from "../../common/helpers/http";
import apiConfig from "../../config/api";
import HTTPClient from "../../lib/http";
import { Category, CategoryResponse } from "./interface";

const httpClient = HTTPClient(apiConfig.service.main);

export const getCategoriesService = (
  token: string,
  queryParams?: {
    page?: number;
    limit?: number;
  }
): Promise<Category[]> => {
  const query = new URLSearchParams(queryParams as any).toString();
  return httpClient.getHttpRequest<Category[]>(
    `/api/categories${query ? `?${query}` : ""}`,
    { headers: wrapTokenAsHeader(token) }
  );
};

export const getCategoryDetailService = (
  token: string,
  id: number
): Promise<Category> =>
  httpClient.getHttpRequest<Category>(`/api/categories/${id}`, {
    headers: wrapTokenAsHeader(token),
  });

export const createCategoryService = (
  token: string,
  formData: Omit<Category, "id">
): Promise<CategoryResponse> =>
  httpClient.postHttpRequest<CategoryResponse>("/api/categories", formData, {
    headers: wrapTokenAsHeader(token),
  });

export const updateCategoryService = (
  token: string,
  id: number,
  formData: Partial<Category>
): Promise<CategoryResponse> =>
  httpClient.putHttpRequest<CategoryResponse>(
    `/api/categories/${id}`,
    formData,
    {
      headers: wrapTokenAsHeader(token),
    }
  );

export const deleteCategoryService = (
  token: string,
  id: number
): Promise<{ message: string }> =>
  httpClient.deleteHttpRequest<{ message: string }>(`/api/categories/${id}`, {
    headers: wrapTokenAsHeader(token),
  });
