export interface AuthLoginBodyRequest {
  email: string;
  password: string;
}

export interface AuthRegisterBodyRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  address: string;
}

export interface AuthUpdateProfileRequestBody {
  name?: string;
  phone_number?: string;
  address?: string;
}

export interface AuthChangePasswordRequestBody {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface AuthChangeEmailRequestBody {
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthLoginResponse {
  token: string;
  user: User;
  message?: string;
}

export interface AuthProfileResponse extends User {
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  message?: string;
}

export interface AuthUpdateProfileResponse {
  user: User;
  message: string;
}

export interface AuthChangeProfileResponse {
  message: string;
}

export interface AuthChangeEmailResponse {
  message: string;
}

export interface AuthFeatureFlagResponse {
  features: Record<string, boolean>;
}

export interface AuthUploadVerificationDocumentResponse {
  message: string;
}

export interface AuthAgentSummarySalesTargetResponse {
  data: any;
}
