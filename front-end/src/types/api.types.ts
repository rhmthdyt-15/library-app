export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ErrorResponse {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
