export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone_number: string;
  address: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserBase {
  name: string;
  email: string;
  role: string;
  phone_number: string;
  address: string;
}

export type UserCreateRequest = UserBase & {
  password: string;
};

export type UserUpdateRequest = UserBase & {
  password?: string;
};

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export type UserPaginateResponse = PaginatedResponse<User>;
