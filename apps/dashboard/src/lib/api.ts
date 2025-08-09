import type { ProductFormValues } from '@/types/product'
import axios from 'axios'

const BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.canto-store.com/api'
    : 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
})

export const api = {
  getProducts: async () => {
    const response = await apiClient.get('/product')
    return response.data
  },

  getProductById: async (productId: number) => {
    const response = await apiClient.get(`/product/id/${productId}`)
    return response.data
  },

  updateProduct: async (productId: number, data: ProductFormValues) => {
    const response = await apiClient.put(`/product/id/${productId}`, data)
    return response.data
  },

  updateProductStatus: async (productId: number, status: string) => {
    const response = await apiClient.put(`/product/id/${productId}`, {
      status,
    })
    return response.data
  },

  getProductFilters: async () => {
    const response = await apiClient.get('/product/filters')
    return response.data
  },

  getCategories: async () => {
    const response = await apiClient.get('/categories')
    return response.data
  },

  getBrands: async () => {
    const response = await apiClient.get('/brand')
    return response.data
  },

  getSellers: async () => {
    const response = await apiClient.get('/seller')
    return response.data
  },
  getUsers: async () => {
    const response = await apiClient.get('/dashboard/users')
    return response.data
  },
  getLatestActivities: async (): Promise<string[]> => {
    const response = await apiClient.get('/dashboard/latest-activities')
    return response.data
  },
  getDashboardCounts: async (): Promise<{
    product: {
      total: number
      active: number
      pending: number
    }
    brand: {
      total: number
    }
    seller: {
      total: number
    }
    user: {
      total: number
    }
  }> => {
    const response = await apiClient.get('/dashboard/dashboard-counts')
    return response.data
  },
}
