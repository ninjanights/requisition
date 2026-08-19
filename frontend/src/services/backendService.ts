import api from "./api";

export type BackendStatus = any;

export const getBackendStatus = async (): Promise<BackendStatus> => {
  const response = await api.get("/health/");
  return response.data;
};

export default { getBackendStatus };
