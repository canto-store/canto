import axios from "axios";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.canto-store.com/api"
    : "http://localhost:8000/api";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default api;
