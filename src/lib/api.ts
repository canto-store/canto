import axios from "axios";

const BACKEND_URL = "https://mock.apidog.com/m1/885156-866838-default/api";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default api;
