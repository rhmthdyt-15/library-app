import { User } from "../user/interface";
import { Book } from "../book/interface";

export interface Borrowing {
  id: number;
  user_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: "dipinjam" | "dikembalikan" | "terlambat";
  notes: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  book?: Book;
}

export interface BorrowingCreateRequest {
  book_id: number;
  borrow_date: string;
  due_date: string;
  notes?: string;
}

export interface BorrowingCreateWithAdminRequest {
  email: string;
  isbn: string;
  borrow_date: string;
  due_date: string;
  notes?: string;
}

export interface BorrowingExtendRequest {
  new_due_date: string;
}

export interface BorrowingResponse {
  message: string;
  borrowing: Borrowing;
}

export interface OverdueCheckResponse {
  message: string;
  updated_count: number;
}

export interface ReportRequest {
  start_date: string;
  end_date: string;
  type: "borrowed" | "returned" | "all";
}

export interface ReportResponse {
  statistics: {
    total: number;
    returned: number;
    borrowed: number;
    overdue: number;
  };
  borrowings: Borrowing[];
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export type BorrowingPaginateResponse = PaginatedResponse<Borrowing>;
