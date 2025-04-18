// src/services/category/interface.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryResponse {
  data: Category;
  message: string;
}

export interface CategoryListResponse {
  data: Category[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
