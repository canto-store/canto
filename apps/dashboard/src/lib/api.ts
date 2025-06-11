import axios from "axios";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.canto-store.com/api"
    : "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Add request interceptor for common headers
apiClient.interceptors.request.use(
  (config) => {
    // Add any common headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for common error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here if needed
    return Promise.reject(error);
  }
);

// API functions for data fetching
export const api = {
  // Products
  getProducts: async () => {
    const response = await apiClient.get("/product");
    return response.data;
  },

  getProductById: async (productId: number) => {
    const response = await apiClient.get(`/product/id/${productId}`);
    return response.data;
  },

  updateProduct: async (productId: number, data: any) => {
    const response = await apiClient.put(`/product/id/${productId}`, data);
    return response.data;
  },

  updateProductStatus: async (productId: number, status: string) => {
    const response = await apiClient.put(`/product/id/${productId}`, {
      status,
    });
    return response.data;
  },

  getProductFilters: async () => {
    const response = await apiClient.get("/product/filters");
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },

  // Brands
  getBrands: async () => {
    const response = await apiClient.get("/brand");
    return response.data;
  },

  // Sellers
  getSellers: async () => {
    const response = await apiClient.get("/seller");
    return response.data;
  },
};
