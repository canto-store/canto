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

  const updateVariantSet = (index: number, variant: SelectedVariant) => {
    const newVariantSets = [...variantSets]
    newVariantSets[index] = variant
    setVariantSets(newVariantSets)
    form.setValue('variants', newVariantSets)
  }

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
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )
                )}
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
          <AlertDialog open={showUploadModal} onOpenChange={setShowUploadModal}>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Image Upload Guidelines</AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  Please follow these guidelines for the best display quality:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Square aspect ratio (1:1)</li>
                  <li>High quality images (minimum 800x800px)</li>
                  <li>Maximum file size (4MB per image)</li>
                  <li>Supported formats (JPG, PNG, WebP)</li>
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => fileInputRefs.current[setIndex]?.click()}
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
