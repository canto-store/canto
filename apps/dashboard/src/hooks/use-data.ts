import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ProductFormValues, ProductOption } from '@/types/product'
import type { Return } from '@/types/return'
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@canto/types/category'

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

// Categories hook
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  })
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => api.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// Update category mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data }: { data: UpdateCategoryDto }) =>
      api.updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
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

export function useGetHomeProducts() {
  return useQuery({
    queryKey: ['home-products'],
    queryFn: api.getHomepage,
  })
}
export function useCreateHomeSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createHomeSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-sections'] })
      queryClient.invalidateQueries({ queryKey: ['home-products'] })
    },
  })
}

export function useUpdateHomeSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: number
      data: { title: string; position: number }
    }) => api.updateHomeSection(sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-sections'] })
      queryClient.invalidateQueries({ queryKey: ['home-products'] })
    },
  })
}

export function useDeleteHomeSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteHomeSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-sections'] })
      queryClient.invalidateQueries({ queryKey: ['home-products'] })
    },
  })
}

export function useAddProductToSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sectionId,
      productId,
      position,
    }: {
      sectionId: number
      productId: number
      position?: number
    }) =>
      api.addProductToSection({
        homepageSectionId: sectionId,
        productId,
        position: position || 0,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['home-sections'] })
      queryClient.invalidateQueries({ queryKey: ['home-products'] })
      queryClient.invalidateQueries({
        queryKey: ['section-products', variables.sectionId],
      })
    },
  })
}

export function useRemoveProductFromSection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId }: { sectionId: number; productId: number }) =>
      api.removeProductFromSection(productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['home-sections'] })
      queryClient.invalidateQueries({ queryKey: ['home-products'] })
      queryClient.invalidateQueries({
        queryKey: ['section-products', variables.sectionId],
      })
    },
  })
}

export function useSectionProducts(sectionId: number) {
  return useQuery({
    queryKey: ['section-products', sectionId],
    queryFn: () => api.getSectionProducts(sectionId),
    enabled: !!sectionId,
  })
}
