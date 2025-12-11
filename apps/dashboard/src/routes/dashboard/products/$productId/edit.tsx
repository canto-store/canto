import { useEffect, useState, useMemo, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'

import {
  AlertCircleIcon,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Loader2,
} from 'lucide-react'
import { productFormSchema, type ProductFormValues } from '@/types/product'
import { useProductOptions, useUpdateProduct } from '@/hooks/use-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { parseApiError } from '@/lib/utils'
import ProductVariants from '@/components/products/product-variants'

type CategoryChild = {
  id: number
  name: string
  slug: string
  image: string | null
  aspect: string
  coming_soon: boolean
}

type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  aspect: string
  coming_soon: boolean
  children: CategoryChild[]
}

export const Route = createFileRoute('/dashboard/products/$productId/edit')({
  loader: async ({ params }) => {
    const product = await api.getProductById(Number(params.productId))
    const categories = await api.getCategories()
    return { product, categories }
  },
  gcTime: 0,
  component: EditProduct,
})

// Form schema

export default function EditProduct() {
  const { productId } = Route.useParams()
  const { product, categories } = Route.useLoaderData()

  console.log(
    'EditProduct RENDER - categories:',
    categories,
    'product.category:',
    product.category
  )

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [changedFields, setChangedFields] = useState<
    Record<string, { old: any; new: any }>
  >({})
  const [imagePreview, setImagePreview] = useState<string | null>(
    product.image || null
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const {
    mutateAsync: updateProduct,
    isPending,
    isError,
    error,
  } = useUpdateProduct()

  const { data: options } = useProductOptions()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description || '',
      image: product.image || '',
      category: product.category,
      subcategories: product.subcategories || [],
      status: product.status,
      // rejectionReason: product.rejection?.reason || '',
      variants: product.variants,
      returnWindow: product.returnWindow || 0,
    },
  })

  const selectedCategoryId = form.watch('category')

  // Debug: log categories structure on mount
  useEffect(() => {
    console.log('categories from loader:', categories)
    console.log('product.category:', product.category)
  }, [])

  const selectedCategory = useMemo(() => {
    console.log(
      'Computing selectedCategory, selectedCategoryId:',
      selectedCategoryId,
      'type:',
      typeof selectedCategoryId
    )
    const found = (categories as Category[]).find(c => {
      console.log(
        'Comparing category id:',
        c.id,
        'type:',
        typeof c.id,
        'with selectedCategoryId:',
        selectedCategoryId
      )
      return c.id === selectedCategoryId
    })
    console.log('Found category:', found)
    return found
  }, [categories, selectedCategoryId])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [form.formState.isDirty])

  const handleNavigateAway = () => {
    if (form.formState.isDirty) {
      setShowUnsavedDialog(true)
    } else {
      router.history.back()
    }
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPG, PNG, WebP, or GIF.')
      return
    }

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert('File size exceeds 4MB limit.')
      return
    }

    // Show preview immediately
    setImagePreview(URL.createObjectURL(file))
    setIsUploadingImage(true)

    try {
      const result = await api.uploadImage(file, 'products')
      form.setValue('image', result.fileUrl)
    } catch (uploadError) {
      console.error('Failed to upload image:', uploadError)
      alert('Failed to upload image. Please try again.')
      setImagePreview(product.image || null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } finally {
      setIsUploadingImage(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    form.setValue('image', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getChangedFields = (data: ProductFormValues) => {
    const changes: Record<string, { old: any; new: any }> = {}

    if (data.name !== product.name) {
      changes.name = { old: product.name, new: data.name }
    }
    if (data.description !== product.description) {
      changes.description = {
        old: product.description || '',
        new: data.description,
      }
    }
    if (data.image !== (product.image || '')) {
      changes.image = {
        old: 'Image will be updated',
        new: 'Image will be updated',
      }
    }
    if (data.category !== product.category) {
      const oldCategory = categories.find(
        (c: any) => c.id === product.category
      )?.name
      const newCategory = categories.find(
        (c: any) => c.id === data.category
      )?.name
      changes.category = { old: oldCategory, new: newCategory }
    }
    if (data.status !== product.status) {
      changes.status = { old: product.status, new: data.status }
    }
    if (data.status === 'REJECTED') {
      changes.rejectionReason = {
        old: product.rejectionReason || '',
        new: data.rejectionReason,
      }
    }
    if (data.returnWindow !== product.returnWindow) {
      changes.returnWindow = {
        old: product.returnWindow || 0,
        new: data.returnWindow || 0,
      }
    }
    // Check for subcategory changes
    const oldSubcategories = product.subcategories || []
    const newSubcategories = data.subcategories || []
    const subcategoriesChanged =
      oldSubcategories.length !== newSubcategories.length ||
      oldSubcategories.some((id: number) => !newSubcategories.includes(id)) ||
      newSubcategories.some((id: number) => !oldSubcategories.includes(id))

    if (subcategoriesChanged) {
      // Get all subcategory names from all categories
      const allSubcategories = (categories as Category[]).flatMap(
        c => c.children || []
      )
      const oldNames =
        oldSubcategories
          .map((id: number) => allSubcategories.find(sc => sc.id === id)?.name)
          .filter(Boolean)
          .join(', ') || 'None'
      const newNames =
        newSubcategories
          .map((id: number) => allSubcategories.find(sc => sc.id === id)?.name)
          .filter(Boolean)
          .join(', ') || 'None'
      changes.subcategories = { old: oldNames, new: newNames }
    }
    for (const variant of data.variants) {
      const oldVariant = product.variants.find((v: any) => v.id === variant.id)

      if (variant.price !== oldVariant?.price) {
        changes[`variant_${variant.id}_price`] = {
          old: oldVariant?.price,
          new: variant.price,
        }
      }
      if (variant.stock !== oldVariant?.stock) {
        changes[`variant_${variant.id}_stock`] = {
          old: oldVariant?.stock,
          new: variant.stock,
        }
      }
      if (variant.options !== oldVariant?.options) {
        // Compare each option value and get the variant value from options
        const oldOptions = oldVariant?.options || []
        const newOptions = variant.options || []

        // Check if any option values have changed
        const optionChanges = newOptions
          .map((newOption, index) => {
            const oldOption = oldOptions[index]

            // Handle case where old option was undefined (new option added)
            if (!oldOption) {
              const optionData = options?.find(
                opt => opt.id === newOption.optionId
              )
              const variantValue =
                optionData?.values?.find(val => val.id === newOption.valueId)
                  ?.value || `Value ${newOption.valueId}`

              return {
                optionName: optionData?.name || `Option ${index + 1}`,
                old: 'Not set',
                new: variantValue,
              }
            }

            // Handle case where option value changed
            if (newOption.valueId !== oldOption.valueId) {
              const optionData = options?.find(
                opt => opt.id === newOption.optionId
              )

              // Get the actual values for both old and new options
              const oldVariantValue =
                optionData?.values?.find(val => val.id === oldOption.valueId)
                  ?.value || `Value ${oldOption.valueId}`
              const newVariantValue =
                optionData?.values?.find(val => val.id === newOption.valueId)
                  ?.value || `Value ${newOption.valueId}`

              return {
                optionName: optionData?.name || `Option ${index + 1}`,
                old: oldVariantValue,
                new: newVariantValue,
              }
            }

            return null
          })
          .filter(
            (change): change is NonNullable<typeof change> => change !== null
          )

        if (optionChanges.length > 0) {
          changes[`variant_${variant.id}_options`] = {
            old: optionChanges
              .map(change => `${change.optionName}: ${change.old}`)
              .join(', '),
            new: optionChanges
              .map(change => `${change.optionName}: ${change.new}`)
              .join(', '),
          }
        }
      }

      // Check for variant image changes
      const oldImages = oldVariant?.images || []
      const newImages = variant.images || []
      const imagesChanged =
        oldImages.length !== newImages.length ||
        oldImages.some((img: string) => !newImages.includes(img)) ||
        newImages.some((img: string) => !oldImages.includes(img))

      if (imagesChanged) {
        const oldCount = oldImages.length
        const newCount = newImages.length
        changes[`variant_${variant.id}_images`] = {
          old:
            oldCount === 0
              ? 'No images'
              : `${oldCount} image${oldCount > 1 ? 's' : ''}`,
          new:
            newCount === 0
              ? 'No images'
              : `${newCount} image${newCount > 1 ? 's' : ''}`,
        }
      }
    }

    return changes
  }

  const handleSubmit = async (data: ProductFormValues) => {
    const changes = getChangedFields(data)
    setChangedFields(changes)

    if (Object.keys(changes).length > 0) {
      setShowConfirmDialog(true)
    } else {
      handleNavigateAway()
    }
  }

  const onConfirmSubmit = async () => {
    const currentValues = form.getValues()
    const changedData = Object.entries(changedFields).reduce(
      (acc, [field]) => {
        // Map the field name back to the actual data field name
        const dataField = field.startsWith('variant') ? 'variants' : field
        if (dataField in currentValues) {
          const key = dataField as keyof ProductFormValues
          acc[key] = currentValues[key]
        }
        return acc
      },
      {} as Record<keyof ProductFormValues, any>
    )
    changedData.id = Number(productId)
    updateProduct({
      product: changedData as ProductFormValues,
    }).then(() => {
      router.history.back()
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={handleNavigateAway}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <Form {...form}>
        {isError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to update product.</AlertTitle>
            <AlertDescription>
              <p>Please try again.</p>
              <p>{parseApiError(error)}</p>
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative w-48 h-48">
                    <img
                      src={imagePreview}
                      alt="Product image"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-48 h-48 border-dashed"
                    disabled={isUploadingImage}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {isUploadingImage ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {isUploadingImage
                          ? 'Uploading...'
                          : 'Click to upload image'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        JPG, PNG, WebP, GIF (max 4MB)
                      </span>
                    </div>
                  </Button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={value => {
                    field.onChange(Number(value))
                    // Clear subcategories when category changes
                    form.setValue('subcategories', [])
                  }}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(
                      (category: { id: number; name: string }) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCategory &&
            selectedCategory.children &&
            selectedCategory.children.length > 0 && (
              <FormField
                control={form.control}
                name="subcategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategories</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {selectedCategory.children.map(subcategory => (
                        <div
                          key={subcategory.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`subcategory-${subcategory.id}`}
                            checked={(field.value || []).includes(
                              subcategory.id
                            )}
                            onCheckedChange={(checked: boolean) => {
                              const currentValues = field.value || []
                              if (checked) {
                                field.onChange([
                                  ...currentValues,
                                  subcategory.id,
                                ])
                              } else {
                                field.onChange(
                                  currentValues.filter(
                                    id => id !== subcategory.id
                                  )
                                )
                              }
                            }}
                          />
                          <label
                            htmlFor={`subcategory-${subcategory.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {subcategory.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

          <FormField
            control={form.control}
            name="returnWindow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Window (days)</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProductVariants />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch('status') === 'REJECTED' && (
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleNavigateAway}
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation dialog for save changes */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                Please review the following changes:
                <div className="mt-4 space-y-2">
                  {Object.entries(changedFields).map(([field, values]) => (
                    <div
                      key={field}
                      className="flex flex-row gap-2 items-center"
                    >
                      <span className="font-bold capitalize text-sm">
                        {field}:
                      </span>
                      <span className="text-red-500/90">{values.old}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span className="text-green-500">{values.new}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmSubmit}>
              Confirm Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation dialog for unsaved changes */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.reset() // Reset form state
                router.history.back()
              }}
            >
              Leave Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
