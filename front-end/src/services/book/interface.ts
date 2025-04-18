export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  cover_image?: string;
  stock: number;
  publication_year: number;
  publisher: string;
  category_id: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface BookResponse {
  message: string;
  book: Book;
}

export interface BookPaginateResponse {
  current_page: number;
  data: Book[];
  total: number;
  per_page: number;
  last_page: number;
}

// src/services/book/interface.ts
export interface BorrowedBook {
  id: number;
  title: string;
  author: string;
  borrowed_at: string;
  due_date: string;
}

export interface DashboardSummary {
  borrowed_count: number;
  overdue_soon: number;
  total_history: number;
}
