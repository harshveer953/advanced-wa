import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://bizflow-d0vt.onrender.com";

let onUnauthorized = null;
export const setOnUnauthorized = (cb) => {
  onUnauthorized = cb;
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof onUnauthorized === "function") onUnauthorized();
    }
    return Promise.reject(err);
  }
);
