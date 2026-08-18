import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string | null;
  role: "ADMIN" | "PUBLIC";
}

export interface MeResponse {
  authenticated: boolean;
  user: AuthUser | null;
}

export interface LoginResponse {
  message: string;
  user: string;
  role: "ADMIN" | "PUBLIC";
}

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/auth/login",
    credentials,
  );
console.log(response, "45");
  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get<MeResponse>(
    "/api/auth/me",
  );
console.log(response);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};