import { useUserStore } from '@/stores/useUserStore'
import type { ProductFormValues } from '@/types/product'
import axios from 'axios'

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
})

apiClient.interceptors.request.use(config => {
  const token = useUserStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  getProducts: async () => {
    const response = await apiClient.get('/product')
    return response.data
  },

  getProductById: async (productId: number) => {
    const response = await apiClient.get<ProductFormValues>(
      `/product/id/${productId}`
    )
    return response.data
  },

  updateProductForm: async (data: ProductFormValues) => {
    const response = await apiClient.put(`/product/update-form`, data)
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
    const response = await apiClient.get('/categories/all')
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
  getProductOptions: async () => {
    const response = await apiClient.get('/product/options')
    return response.data
  },
  createProductOptionValue: async (data: {
    productOptionId: number
    value: string
  }) => {
    const response = await apiClient.post('/product/options/values', data)
    return response.data
  },
  createProductOption: async (data: { name: string }) => {
    const response = await apiClient.post('/product/options', data)
    return response.data
  },
  getOrders: async () => {
    const response = await apiClient.get('/orders')
    return response.data
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await apiClient.put(`/orders`, {
      id: orderId,
      data: { status },
    })
    return response.data
  },
  getReturns: async () => {
    const response = await apiClient.get('/returns/all')
    return response.data
  },
  updateReturnStatus: async (returnId: number, status: string) => {
    const response = await apiClient.put(`/returns`, {
      id: returnId,
      data: { status },
    })
    return response.data
  },
  getHomepage: async () => {
    const response = await apiClient.get('/home/products')
    return response.data
  },
  getHomeSections: async () => {
    const response = await apiClient.get('/home/sections')
    return response.data
  },
  createHomeSection: async (data: { title: string; position: number }) => {
    const response = await apiClient.post('/home/sections', data)
    return response.data
  },
  updateHomeSection: async (
    sectionId: number,
    data: { title: string; position: number }
  ) => {
    const response = await apiClient.put(`/home/sections/${sectionId}`, data)
    return response.data
  },
  deleteHomeSection: async (sectionId: number) => {
    const response = await apiClient.delete(`/home/sections/${sectionId}`)
    return response.data
  },
  addProductToSection: async (data: {
    homepageSectionId: number
    productId: number
    position: number
  }) => {
    const response = await apiClient.post(`/home/products`, data)
    return response.data
  },
  removeProductFromSection: async (productId: number) => {
    const response = await apiClient.delete(
      `/home/sections/products/${productId}`
    )
    return response.data
  },
  getSectionProducts: async (sectionId: number) => {
    const response = await apiClient.get(`/home/sections/${sectionId}/products`)
    return response.data
  },
}
