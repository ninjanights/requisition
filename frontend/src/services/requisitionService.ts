import api from "./api";

export const requisitionService = {
  getAll: async () => api.get("/requisitions"),
  getById: async (id: number) => api.get(`/requisitions/${id}`),
  create: async (payload: unknown) => api.post("/requisitions", payload),
  update: async (id: number, payload: unknown) => api.put(`/requisitions/${id}`, payload),
  delete: async (id: number) => api.delete(`/requisitions/${id}`),
};

export default requisitionService;
