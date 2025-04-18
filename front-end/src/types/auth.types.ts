export type UserRole = "admin" | "member";

export interface User {
  id: string;
  username?: string;
  email: string;
  fullName?: string;
  name?: string;
  role: UserRole;
  phone_number?: string;
  address?: string;
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  fullName?: string;
  name?: string;
  email: string;
  username?: string;
  password: string;
  password_confirmation?: string;
  phone_number?: string;
  address?: string;
}

export interface TokenResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PasswordChangeData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
}
