import { createContext, useState, useEffect, ReactNode } from "react";
import {
  User as UserType,
  LoginCredentials,
  RegisterData,
  UserRole,
} from "../types/user.types";
import {
  authLoginService,
  authRegisterService,
  authLogoutService,
} from "../services/auth/http";
import { User } from "../services/auth/interface";

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null; // ✅ Tambahkan token
  updateUser: (user: UserType) => void; // ✅ Tambahkan updateUser
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  updateUser: () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Helper untuk mapping user dari API ke app
const mapApiUserToAppUser = (apiUser: User): UserType => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    role: apiUser.role as UserRole,
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authLoginService({
        email: credentials.email,
        password: credentials.password,
      });

      const receivedToken = response.token;
      setToken(receivedToken);
      localStorage.setItem("token", receivedToken);

      const appUser = mapApiUserToAppUser(response.user);
      setUser(appUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(appUser));
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unknown error occurred");
      }
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authRegisterService({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone_number: data.phone_number,
        address: data.address,
      });

      if (response && response.token) {
        const receivedToken = response.token;
        setToken(receivedToken);
        localStorage.setItem("token", receivedToken);

        if (response.user) {
          const appUser = mapApiUserToAppUser(response.user);
          setUser(appUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(appUser));
        } else {
          console.log("No user data in response, redirecting to login");
        }
      }

      return;
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        setError(error.response.data.message || "Registration failed");
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      setIsLoading(true);

      try {
        await authLogoutService(token);
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoading(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  // ✅ Fungsi untuk update user dari luar (misalnya dari useProfile)
  const updateUser = (updatedUser: UserType) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        token,
        updateUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
