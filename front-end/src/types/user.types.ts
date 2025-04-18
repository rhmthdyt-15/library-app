export type UserRole = "admin" | "member";

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  address?: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  address: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
}
