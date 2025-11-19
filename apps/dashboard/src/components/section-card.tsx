import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Save,
  X,
  Trash2,
  ShoppingCart,
  Edit2,
  Move,
  Plus,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

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

interface SectionCardProps {
  section: HomeSection
  isEditing: boolean
  isExpanded: boolean
  products: Product[]
  isAddingProduct: boolean
  onStartEdit: (section: HomeSection) => void
  onCancelEdit: () => void
  onUpdateSection: (data: any) => void
  onDeleteSection: (sectionId: number) => void
  onToggleExpansion: (sectionId: number) => void
  onAddProduct: (
    sectionId: number,
    productId: number,
    position?: number
  ) => void
  onRemoveProduct: (sectionId: number, productId: number) => void
  onStartAddingProduct: (sectionId: number | null) => void
  updateMutation: any
  editForm: {
    register: any
    handleSubmit: any
    errors: any
    isValid: boolean
  }
  sectionProducts: Product[]
}

export function SectionCard({
  section,
  isEditing,
  isExpanded,
  products,
  isAddingProduct,
  onStartEdit,
  onCancelEdit,
  onUpdateSection,
  onDeleteSection,
  onToggleExpansion,
  onAddProduct,
  onRemoveProduct,
  onStartAddingProduct,
  updateMutation,
  editForm,
  sectionProducts,
}: SectionCardProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [productPosition, setProductPosition] = useState<string>('')

  const handleAddProductWithPosition = () => {
    if (selectedProductId && productPosition) {
      onAddProduct(
        section.id,
        parseInt(selectedProductId),
        parseInt(productPosition)
      )
      setSelectedProductId('')
      setProductPosition('')
    }
  }

  const handleCancelAddProduct = () => {
    setSelectedProductId('')
    setProductPosition('')
    onStartAddingProduct(null)
  }

  if (isEditing) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Edit Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={editForm.handleSubmit(onUpdateSection)}
            className="space-y-4"
          >
            <Label htmlFor={`edit-title-${section.id}`}>Section Title</Label>
            <Input
              id={`edit-title-${section.id}`}
              {...editForm.register('title')}
              className={editForm.errors.title ? 'border-red-500' : ''}
            />
            {editForm.errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {editForm.errors.title.message}
              </p>
            )}
            <Label htmlFor={`edit-position-${section.id}`}>Position</Label>
            <Input
              id={`edit-position-${section.id}`}
              {...editForm.register('position')}
              className={editForm.errors.position ? 'border-red-500' : ''}
            />
            {editForm.errors.position && (
              <p className="text-sm text-red-500 mt-1">
                {editForm.errors.position.message}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!editForm.isValid || updateMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEdit}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpansion(section.id)}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <CardTitle className="text-lg">{section.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Move className="h-3 w-3" />
            Position {section.position}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            {sectionProducts?.length || 0} products
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartEdit(section)}
            className="flex items-center gap-1"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteSection(section.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Products Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Products in this section</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStartAddingProduct(section.id)}
                disabled={isAddingProduct}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>

            {/* Add Product Form */}
            {isAddingProduct && (
              <div className="mb-4 p-3rounded-lg">
                <h5 className="font-medium mb-3">Add Product to Section</h5>
                <div className="space-y-3">
                  <Label htmlFor={`add-product-${section.id}`}>
                    Select Product
                  </Label>
                  <Select
                    value={selectedProductId}
                    onValueChange={setSelectedProductId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label htmlFor={`product-position-${section.id}`}>
                    Position
                  </Label>
                  <Input
                    id={`product-position-${section.id}`}
                    value={productPosition}
                    onChange={e => setProductPosition(e.target.value)}
                    placeholder="Enter position..."
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddProductWithPosition}
                      disabled={!selectedProductId || !productPosition}
                    >
                      Add Product
                    </Button>
                    <Button variant="outline" onClick={handleCancelAddProduct}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Products List */}
            {sectionProducts && sectionProducts.length > 0 ? (
              <div className="space-y-2">
                {sectionProducts.map((product: Product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{product.position}
                      </Badge>
                      <span className="text-sm">{product.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveProduct(section.id, product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No products added to this section yet
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
