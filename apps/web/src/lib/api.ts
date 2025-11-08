import axios from "axios";
import { useUserStore } from "@/stores/useUserStore";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.canto-store.com/api"
    : process.env.NODE_ENV === "test"
      ? "http://api-staging.canto-store.com/api"
      : "http://localhost:8000/api";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useUserStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
