// src/pages/category/hooks.ts
import { useState, useEffect, useMemo } from "react";
import { Category } from "../../services/category/interface";
import {
  getCategoriesService,
  getCategoryDetailService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../../services/category/http";

// Get categories with frontend filters (pagination & search)
export const useCategories = (
  token: string | null,
  filters?: {
    page?: number;
    name?: string;
    perPage?: number;
  }
) => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await getCategoriesService(token);
        setAllCategories(result);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const filteredCategories = useMemo(() => {
    const search = filters?.name?.toLowerCase() || "";
    return allCategories.filter((category) =>
      category.name.toLowerCase().includes(search)
    );
  }, [allCategories, filters?.name]);

  const currentPage = filters?.page || 1;
  const perPage = filters?.perPage || 10;
  const totalPages = Math.ceil(filteredCategories.length / perPage);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    return filteredCategories.slice(startIndex, startIndex + perPage);
  }, [filteredCategories, currentPage, perPage]);

  return {
    categories: paginatedCategories,
    loading,
    error,
    totalPages,
    currentPage,
  };
};

// Get category detail
export const useCategoryDetail = (
  token: string | null,
  categoryId?: number
) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !categoryId) return;

    const fetchCategoryDetail = async () => {
      try {
        setLoading(true);
        const result = await getCategoryDetailService(token, categoryId);
        setCategory(result);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch category detail", err);
        setError("Failed to fetch category detail");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [token, categoryId]);

  return { category, loading, error };
};

// Create category
export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any | null>(null);

  const createCategory = async (
    token: string | null,
    categoryData: { name: string; description?: string }
  ) => {
    if (!token) return;

    try {
      setLoading(true);
      const result = await createCategoryService(token, categoryData);
      setResponse(result);
      setError(null);
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading, error, response };
};

// Update category
export const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any | null>(null);

  const updateCategory = async (
    token: string | null,
    id: number,
    categoryData: { name?: string; description?: string }
  ) => {
    if (!token) return;

    try {
      setLoading(true);
      const result = await updateCategoryService(token, id, categoryData);
      setResponse(result);
      setError(null);
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading, error, response };
};

// Delete category
export const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deleteCategory = async (token: string | null, id: number) => {
    if (!token) return;

    try {
      setLoading(true);
      const result = await deleteCategoryService(token, id);
      setSuccessMessage(result.message);
      setError(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return { deleteCategory, loading, error, successMessage };
};
