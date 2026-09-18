import { api } from "../../services/api";

export const orderAPI = {
  createFromText: (payload) => api.post("/api/orders/from-text", payload),
  list: (status = "") => api.get(`/api/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status })
};
