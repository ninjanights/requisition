export type UserRole = "ADMIN" | "PUBLIC";

export interface User {
  id: number;
  email: string | null;
  role: UserRole;
}

export interface MeResponse {
  authenticated: boolean;
  user: User | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: string;
  role: "ADMIN";
}