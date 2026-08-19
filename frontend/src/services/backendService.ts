import api from "./api";

export interface BackendStatus {
  status: "ok";
  database: number;
}

export const getBackendStatus = async (): Promise<BackendStatus> => {
  const response = await api.get<BackendStatus>("/health");

  if (
    response.data.status !== "ok" ||
    response.data.database !== 1
  ) {
    throw new Error("Backend is not healthy");
  }

  return response.data;
};

export default {
  getBackendStatus,
};