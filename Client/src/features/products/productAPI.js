import { api } from "../../services/api";

export const productAPI = {
  list: (search = "") => api.get(`/api/products${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  create: (payload) => api.post("/api/products", payload),
  update: (id, payload) => api.patch(`/api/products/${id}`, payload),
  remove: (id) => api.delete(`/api/products/${id}`)
};
