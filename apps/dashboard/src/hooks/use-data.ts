import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ProductFormValues, ProductOption } from '@/types/product'
import type { Return } from '@/types/return'

// Products hook
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  })
}

// Product status update mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ product }: { product: ProductFormValues }) => {
      const response = await api.updateProductForm(product)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })
}

// Brands hook
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: api.getBrands,
  })
}

// Sellers hook
export function useSellers() {
  return useQuery({
    queryKey: ['sellers'],
    queryFn: api.getSellers,
  })
}

// Users hook
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  })
}

export function useLatestActivities() {
  return useQuery({
    queryKey: ['latest-activities'],
    queryFn: api.getLatestActivities,
  })
}

export function useDashboardCounts() {
  return useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: api.getDashboardCounts,
  })
}

export function useProductOptions() {
  return useQuery<ProductOption[], Error>({
    queryKey: ['product-options'],
    queryFn: api.getProductOptions,
  })
}

export function useCreateProductOptionValue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createProductOptionValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-options'] })
    },
  })
}

export function useCreateProductOption() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createProductOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-options'] })
    },
  })
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: api.getOrders,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      api.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['orders'] })
    },
  })
}

export function useReturns() {
  return useQuery<{ returnRequests: Return[] }, Error>({
    queryKey: ['returns'],
    queryFn: api.getReturns,
  })
}

export function useUpdateReturnStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ returnId, status }: { returnId: number; status: string }) =>
      api.updateReturnStatus(returnId, status),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['returns'] })
    },
  })
}
