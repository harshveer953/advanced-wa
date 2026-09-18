import { api } from "../../services/api";

export const customerAPI = {
  list: (search = "") => api.get(`/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  byPhone: (phone) => api.get(`/api/customers/phone/${encodeURIComponent(phone)}`)
};
