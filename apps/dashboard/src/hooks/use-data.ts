import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ProductFormValues } from '@/types/product'

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
    mutationFn: async ({
      productId,
      product,
    }: {
      productId: number
      product: ProductFormValues
    }) => {
      const response = await api.updateProduct(productId, product)
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

export function useLatestActivities() {
  return useQuery({
    queryKey: ['latest-activities'],
    queryFn: api.getLatestActivities,
  })
}
