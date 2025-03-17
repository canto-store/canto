import axios, { AxiosError } from "axios";

const BASE_URL = "https://api.canto-store.com";

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await axios.get<T>(`${BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AxiosError(
          (error.response?.data ?? (error.response?.status ?? 0) >= 500)
            ? "Failed to fetch data. Please try again."
            : error.response?.data,
        );
      }
      throw new Error("Unknown Error");
    }
  },

  post: async (
    endpoint: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> => {
    try {
      const response = await axios.post(`${BASE_URL}${endpoint}`, {
        ...data,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AxiosError(
          (error.response?.status ?? 0) >= 500
            ? "Failed to send data. Please try again."
            : error.response?.data,
        );
      }
      throw new Error("Unknown Error");
    }
  },
};
