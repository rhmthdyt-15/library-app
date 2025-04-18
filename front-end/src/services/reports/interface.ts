// src/services/interface/reports.ts
export interface DashboardResponse {
  stats: {
    total_books: number;
    available_books: number;
    total_users: number;
    active_borrowings: number;
    overdue_borrowings: number;
    borrowings_today: number;
    returns_today: number;
    borrowings_this_month: number;
  };
  popular_books: Book[];
  recent_books: Book[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  category_id: number;
  isbn: string;
  description: string;
  cover_image: string | null;
  stock: number;
  publication_year: string;
  publisher: string;
  created_at: string;
  updated_at: string;
  borrowings_count?: number;
  active_borrowings_count?: number;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface BorrowingsReportResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  borrowings: Borrowing[];
  summary: {
    total: number;
    returned: number;
    active: number;
    overdue: number;
  };
}

export interface Borrowing {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  book: Book;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone_number: string | null;
  address: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  borrowings_count?: number;
  active_borrowings_count?: number;
  overdue_borrowings_count?: number;
}

export interface UsersReportResponse {
  users: User[];
  summary: {
    total_users: number;
    users_with_active_borrowings: number;
    users_with_overdue_borrowings: number;
  };
}

export interface BooksReportResponse {
  books: Book[];
  summary: {
    total_books: number;
    available_books: number;
    unavailable_books: number;
    most_borrowed: Book | null;
    total_borrowed_count: number;
  };
}
