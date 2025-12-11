/* eslint-disable */
import { useState, useRef, useEffect } from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useProductOptions } from '@/hooks/use-data'
import { type SelectedVariant } from '@/types/product'
import { Input } from '../ui/input'
import { Plus, X } from 'lucide-react'

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
import { api } from '@/lib/api'

export default function ProductVariants() {
  const form = useFormContext()
  const [variantSets, setVariantSets] = useState<SelectedVariant[]>(() => {
    const initialVariants = form.getValues('variants')
    if (!initialVariants || initialVariants.length === 0) {
      const defaultVariant: SelectedVariant = {
        price: '' as any,
        stock: '' as any,
        options: [],
        images: [],
      }
      form.setValue('variants', [defaultVariant])
      return [defaultVariant]
    }
    return initialVariants
  })
  const { data: options } = useProductOptions()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [currentUploadVariantIndex, setCurrentUploadVariantIndex] = useState<
    number | null
  >(null)

  const updateVariantSet = (index: number, updatedVariant: SelectedVariant) => {
    const newVariants = [...variantSets]
    newVariants[index] = updatedVariant
    setVariantSets(newVariants)
    form.setValue('variants', newVariants)
  }

  const removeImage = (variantIndex: number, imageIndex: number) => {
    const variant = variantSets[variantIndex]
    const newImages = [...(variant.images || [])]
    newImages.splice(imageIndex, 1)
    updateVariantSet(variantIndex, {
      ...variant,
      images: newImages,
    })
  }

  const handleFileChange = async (
    variantIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      const uploadPromises = Array.from(files).map(async file => {
        // Validate file type
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
        ]
        if (!allowedTypes.includes(file.type)) {
          alert(
            `Invalid file type for ${file.name}. Please upload JPG, PNG, WebP, or GIF.`
          )
          return null
        }

        // Validate file size (4MB)
        if (file.size > 4 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 4MB limit.`)
          return null
        }

        const result = await api.uploadImage(file, 'variants')
        return result.fileUrl
      })

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(
        Boolean
      ) as string[]

      if (uploadedUrls.length > 0) {
        const variant = variantSets[variantIndex]
        const newImages = [...(variant.images || []), ...uploadedUrls]
        updateVariantSet(variantIndex, {
          ...variant,
          images: newImages,
        })
      }
    } catch (error) {
      console.error('Failed to upload images:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      // Clear the input
      if (fileInputRefs.current[variantIndex]) {
        fileInputRefs.current[variantIndex].value = ''
      }
    }
  }
  const [newVariantIndex, setNewVariantIndex] = useState<number | null>(null)

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Smooth scroll to newly added variant
  useEffect(() => {
    if (newVariantIndex !== null) {
      const variantElement = document.getElementById(
        `variant-${newVariantIndex}`
      )
      if (variantElement) {
        setTimeout(() => {
          variantElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }, 100)
      }
      setNewVariantIndex(null)
    }
  }, [newVariantIndex])

  return (
    <div>
      <p className="font-xs font-medium mb-2">Variants</p>
      {variantSets.map((variant: SelectedVariant, setIndex: number) => (
        <div
          key={setIndex}
          id={`variant-${setIndex}`}
          className="relative space-y-4 rounded-lg border p-4"
        >
          <p className="text-sm font-medium text-gray-500">{variant.sku}</p>
          {(variant.images || []).length > 0 && (
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {(variant.images || []).map(
                  (image: string, imageIndex: number) => (
                    <div key={imageIndex} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`Variant image ${imageIndex + 1}`}
                        className="w-full h-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(setIndex, imageIndex)}
                        className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                )}
                <div className="flex aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center"
                    onClick={() => {
                      setCurrentUploadVariantIndex(setIndex)
                      setShowUploadModal(true)
                    }}
                  >
                    <Plus className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Add images</p>
                  </div>
                  <input
                    ref={el => {
                      fileInputRefs.current[setIndex] = el
                    }}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleFileChange(setIndex, e)}
                  />
                </div>
              </div>
            </div>
          )}
          {(variant.images || []).length === 0 && (
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div className="flex aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center"
                    onClick={() => {
                      setCurrentUploadVariantIndex(setIndex)
                      setShowUploadModal(true)
                    }}
                  >
                    <Plus className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Add images</p>
                  </div>
                  <input
                    ref={el => {
                      fileInputRefs.current[setIndex] = el
                    }}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleFileChange(setIndex, e)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`variants.${setIndex}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={e => {
                        const value =
                          e.target.value === '' ? '' : Number(e.target.value)
                        field.onChange(value)
                        updateVariantSet(setIndex, {
                          ...variant,
                          price: value as any,
                        })
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variants.${setIndex}.stock`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter stock quantity"
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={e => {
                        const value =
                          e.target.value === '' ? '' : Number(e.target.value)
                        field.onChange(value)
                        updateVariantSet(setIndex, {
                          ...variant,
                          stock: value as any,
                        })
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {options?.map(option => (
              <FormItem key={option.id} className="w-full">
                <div className="flex items-center gap-1">
                  <FormLabel>{option.name}</FormLabel>
                  <span className="text-xs text-gray-400">(optional)</span>
                </div>
                <Select
                  onValueChange={valueId => {
                    const newOptions = [...(variant.options || [])]
                    const existingIndex = newOptions.findIndex(
                      (o: { optionId: number; valueId: number }) =>
                        o.optionId === option.id
                    )

                    if (existingIndex !== -1) {
                      newOptions[existingIndex] = {
                        optionId: option.id,
                        valueId: Number(valueId),
                      }
                    } else {
                      newOptions.push({
                        optionId: option.id,
                        valueId: Number(valueId),
                      })
                    }

                    updateVariantSet(setIndex, {
                      ...variant,
                      options: newOptions,
                    })
                  }}
                  value={variant.options
                    ?.find(
                      (o: { optionId: number; valueId: number }) =>
                        o.optionId === option.id
                    )
                    ?.valueId.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {option.values.map(value => (
                      <SelectItem key={value.id} value={value.id.toString()}>
                        {value.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            ))}
          </div>
          <AlertDialog
            open={showUploadModal}
            onOpenChange={open => {
              setShowUploadModal(open)
              if (!open) {
                setCurrentUploadVariantIndex(null)
              }
            }}
          >
            <AlertDialogContent className="">
              <AlertDialogHeader>
                <AlertDialogTitle>Image Upload Guidelines</AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  Please follow these guidelines for the best display quality:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <ul className="list-disc pl-5 text-sm">
                  <li>Square aspect ratio (1:1)</li>
                  <li>High quality images (minimum 800x800px)</li>
                  <li>Maximum file size (4MB per image)</li>
                  <li>Supported formats (JPG, PNG, WebP)</li>
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (currentUploadVariantIndex !== null) {
                      fileInputRefs.current[currentUploadVariantIndex]?.click()
                    }
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  )
}
