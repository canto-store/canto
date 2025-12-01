import { useState } from 'react'
import {
  useCreateHomeSection,
  useUpdateHomeSection,
  useDeleteHomeSection,
  useAddProductToSection,
  useRemoveProductFromSection,
  useProducts,
  useGetHomeProducts,
} from '@/hooks/use-data'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SectionCard } from '@/components/section-card'

export const Route = createFileRoute('/dashboard/homepage')({
  component: RouteComponent,
})

interface HomeSection {
  id: number
  title: string
  position: number
  createdAt: string
  updatedAt: string
  products?: Product[]
}

interface Product {
  id: number
  name: string
  position: number
}

const homeSectionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  position: z
    .string()
    .min(1, 'Position is required')
    .transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val >= 1, {
      message: 'Position must be a number greater than 0',
    }),
})

type HomeSectionFormData = z.infer<typeof homeSectionSchema>

function RouteComponent() {
  const { data: sections, isLoading, error } = useGetHomeProducts()
  const { data: products } = useProducts()
  const createSectionMutation = useCreateHomeSection()
  const updateSectionMutation = useUpdateHomeSection()
  const deleteSectionMutation = useDeleteHomeSection()
  const addProductMutation = useAddProductToSection()
  const removeProductMutation = useRemoveProductFromSection()

  const [isAddingSection, setIsAddingSection] = useState(false)
  const [editingSection, setEditingSection] = useState<number | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set()
  )
  const [addingProductToSection, setAddingProductToSection] = useState<
    number | null
  >(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(homeSectionSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      position: '',
    },
  })

  const onSubmit = async (data: HomeSectionFormData) => {
    try {
      await createSectionMutation.mutateAsync({
        title: data.title,
        position: data.position,
      })
      reset()
      setIsAddingSection(false)
    } catch (error) {
      console.error('Failed to create section:', error)
    }
  }

  const handleCancelAdd = () => {
    reset()
    setIsAddingSection(false)
  }

  // Edit form for sections
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: editErrors, isValid: isEditValid },
  } = useForm({
    resolver: zodResolver(homeSectionSchema),
    mode: 'onChange',
  })

  const startEditing = (section: HomeSection) => {
    setEditingSection(section.id)
    setValueEdit('title', section.title)
    setValueEdit('position', section.position.toString())
  }

  const handleUpdateSection = async (data: any) => {
    if (!editingSection) return
    try {
      await updateSectionMutation.mutateAsync({
        sectionId: editingSection,
        data: {
          title: data.title,
          position: data.position,
        },
      })
      setEditingSection(null)
      resetEdit()
    } catch (error) {
      console.error('Failed to update section:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    resetEdit()
  }

  const handleDeleteSection = async (sectionId: number) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteSectionMutation.mutateAsync(sectionId)
      } catch (error) {
        console.error('Failed to delete section:', error)
      }
    }
  }

  const toggleSectionExpansion = (sectionId: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleAddProduct = async (
    sectionId: number,
    productId: number,
    position?: number
  ) => {
    try {
      await addProductMutation.mutateAsync({
        sectionId,
        productId,
        position,
      })
      setAddingProductToSection(null)
    } catch (error) {
      console.error('Failed to add product to section:', error)
    }
  }

  const handleRemoveProduct = async (sectionId: number, productId: number) => {
    try {
      await removeProductMutation.mutateAsync({
        sectionId,
        productId,
      })
    } catch (error) {
      console.error('Failed to remove product from section:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Homepage Sections</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500">
            Error loading sections: {error.message}
          </p>
        </div>
      </div>
    )
  }

  const sortedSections = sections
    ? [...sections].sort(
        (a: HomeSection, b: HomeSection) => a.position - b.position
      )
    : []

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Homepage Sections</h1>
        <Button
          onClick={() => setIsAddingSection(true)}
          disabled={isAddingSection}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Section
        </Button>
      </div>

      <div className="space-y-4">
        {/* Add New Section Form */}
        {isAddingSection && (
          <Card className="border-2 border-dashed ">
            <CardHeader>
              <CardTitle className="text-lg">Add New Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Label htmlFor="section-title">Section Title</Label>
                <Input
                  id="section-title"
                  {...register('title')}
                  placeholder="Enter section title..."
                  autoFocus
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
                <Label htmlFor="section-position">Position</Label>
                <Input
                  id="section-position"
                  {...register('position')}
                  placeholder="Enter position number..."
                  className={errors.position ? 'border-red-500' : ''}
                />
                {errors.position && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.position.message}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!isValid || createSectionMutation.isPending}
                  >
                    {createSectionMutation.isPending
                      ? 'Adding...'
                      : 'Add Section'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelAdd}
                    disabled={createSectionMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Sections */}
        {sortedSections.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">No sections found</p>
              <p className="text-sm text-gray-400">
                Click "Add New Section" to create your first section
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedSections.map((section: HomeSection) => (
            <SectionCard
              key={section.id}
              section={section}
              isEditing={editingSection === section.id}
              isExpanded={expandedSections.has(section.id)}
              products={products || []}
              isAddingProduct={addingProductToSection === section.id}
              onStartEdit={startEditing}
              onCancelEdit={handleCancelEdit}
              onUpdateSection={handleUpdateSection}
              onDeleteSection={handleDeleteSection}
              onToggleExpansion={toggleSectionExpansion}
              onAddProduct={handleAddProduct}
              onRemoveProduct={handleRemoveProduct}
              onStartAddingProduct={setAddingProductToSection}
              updateMutation={updateSectionMutation}
              sectionProducts={section.products ?? []}
              editForm={{
                register: registerEdit,
                handleSubmit: handleSubmitEdit,
                errors: editErrors,
                isValid: isEditValid,
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
