import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  Plus,
  ChevronRight,
  ChevronDown,
  Upload,
  X,
  Pencil,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from '@/hooks/use-data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/badge'
import {
  createCategorySchema,
  type Category,
  type CreateCategoryDto,
} from '@canto/types/category'
import { api } from '@/lib/api'

// Hook to delay showing loading state
function useDelayedLoading(isLoading: boolean, delay: number = 300) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      setShowLoading(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, delay])

  return showLoading
}

export const Route = createFileRoute('/dashboard/categories')({
  component: CategoriesPage,
})

// Loading skeleton component
function CategoriesTableSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoriesPage() {
  const { data: categories = [], isLoading, error } = useCategories()
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const showSkeleton = useDelayedLoading(isLoading)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  )
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryDto>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      aspect: 'SQUARE',
      description: '',
      image: '',
      coming_soon: false,
    },
  })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ]
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
      setIsUploading(true)

      try {
        const result = await api.uploadImage(file)
        setValue('image', result.fileUrl)
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError)
        alert('Failed to upload image. Please try again.')
        setImagePreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } finally {
        setIsUploading(false)
      }
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setValue('image', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const startEditing = (category: Category) => {
    setEditingCategory(category)
    setValue('name', category.name)
    setValue('aspect', category.aspect)
    setValue('description', category.description || '')
    setValue('image', category.image || '')
    setValue('parentId', category.parentId || undefined)
    setValue('coming_soon', category.coming_soon)
    if (category.image) {
      setImagePreview(category.image)
    }
    setIsFormOpen(true)
  }

  const cancelEditing = () => {
    setEditingCategory(null)
    reset()
    removeImage()
    setIsFormOpen(false)
  }

  const onSubmit = async (data: CreateCategoryDto) => {
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data: {
            ...data,
            description: data.description || undefined,
            image: data.image || undefined,
            parentId: data.parentId || null,
          },
        })
      } else {
        // Create new category
        await createCategoryMutation.mutateAsync({
          ...data,
          description: data.description || undefined,
          image: data.image || undefined,
        })
      }
      reset()
      removeImage()
      setEditingCategory(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  const toggleExpanded = (categoryId: number) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // Only parent categories (those without parentId) for the main table
  const parentCategories: Category[] = categories.filter(
    (cat: Category) => cat.parentId === null
  )

  // Available parent categories for the dropdown (exclude the category being edited)
  const availableParentCategories = parentCategories.filter(
    (cat: Category) => !editingCategory || cat.id !== editingCategory.id
  )

  // Flatten categories for display - parents with their children inline when expanded
  const flattenedCategories: (Category & { isChild?: boolean })[] = []
  parentCategories.forEach(parent => {
    flattenedCategories.push(parent)
    if (expandedCategories.has(parent.id) && parent.children?.length) {
      parent.children.forEach(child => {
        // Ensure parentId is set when flattening children
        flattenedCategories.push({
          ...child,
          isChild: true,
          parentId: parent.id,
        })
      })
    }
  })

  const columns: ColumnDef<Category & { isChild?: boolean }>[] = [
    {
      id: 'expand',
      header: '',
      cell: ({ row }) => {
        const category = row.original
        // If it's a child, show indent space
        if (category.isChild) {
          return <div className="w-8 ml-4" />
        }
        const hasChildren = category.children && category.children.length > 0
        if (!hasChildren) return <div className="w-8" />
        const isExpanded = expandedCategories.has(category.id)
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpanded(category.id)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )
      },
    },
    {
      id: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const category = row.original
        const image = category.image
        const size = category.isChild ? 'h-8 w-8' : 'h-10 w-10'
        return image ? (
          <img
            src={image}
            alt={category.name}
            className={`${size} rounded object-cover`}
          />
        ) : (
          <div
            className={`${size} rounded bg-muted flex items-center justify-center text-muted-foreground text-xs`}
          >
            N/A
          </div>
        )
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const category = row.original
        return (
          <div
            className={
              category.isChild ? 'pl-4 text-muted-foreground' : 'font-medium'
            }
          >
            {category.isChild && <span className="mr-2">↳</span>}
            {category.name}
          </div>
        )
      },
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => {
        const slug = row.getValue('slug') as string
        return slug || '-'
      },
    },
    {
      accessorKey: 'aspect',
      header: 'Aspect',
      cell: ({ row }) => {
        const aspect = row.getValue('aspect') as string
        return <Badge variant="outline">{aspect}</Badge>
      },
    },
    {
      accessorKey: 'coming_soon',
      header: 'Coming Soon',
      cell: ({ row }) => {
        const comingSoon = row.getValue('coming_soon') as boolean
        return comingSoon ? (
          <Badge variant="secondary">Coming Soon</Badge>
        ) : null
      },
    },
    {
      id: 'children',
      header: 'Subcategories',
      cell: ({ row }) => {
        const category = row.original
        if (category.isChild) return null
        const count = category.children?.length || 0
        return count > 0 ? (
          <Badge variant="outline">{count} subcategories</Badge>
        ) : (
          '-'
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const category = row.original
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditing(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  if (showSkeleton) {
    return <CategoriesTableSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">
            Error loading categories
          </h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories and subcategories
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null)
            reset()
            removeImage()
            setIsFormOpen(!isFormOpen)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </CardTitle>
            <CardDescription>
              {editingCategory
                ? 'Update category details and parent assignment'
                : 'Add a new category or subcategory to organize your products'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Category name"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aspect">Aspect *</Label>
                  <Controller
                    name="aspect"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select aspect" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SQUARE">Square</SelectItem>
                          <SelectItem value="RECTANGLE">Rectangle</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.aspect && (
                    <p className="text-sm text-destructive">
                      {errors.aspect.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentId">Parent Category (Optional)</Label>
                  <Controller
                    name="parentId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={val =>
                          field.onChange(
                            val === 'none' ? undefined : parseInt(val)
                          )
                        }
                        value={field.value?.toString() || 'none'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="No parent (top-level)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            No parent (top-level)
                          </SelectItem>
                          {availableParentCategories.map((cat: Category) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image (Optional)</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-dashed"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload image
                        </span>
                        <span className="text-xs text-muted-foreground">
                          JPG, PNG, WebP, GIF (max 4MB)
                        </span>
                      </div>
                    </Button>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Category description..."
                    {...register('description')}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="coming_soon"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="coming_soon"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="coming_soon">Coming Soon</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting || isUploading}>
                  {isUploading
                    ? 'Uploading image...'
                    : isSubmitting
                      ? editingCategory
                        ? 'Saving...'
                        : 'Creating...'
                      : editingCategory
                        ? 'Save Changes'
                        : 'Create Category'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <DataTable columns={columns} data={flattenedCategories} />
    </div>
  )
}
