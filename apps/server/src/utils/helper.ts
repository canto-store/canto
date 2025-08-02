import { Sale } from '@prisma/client'

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, '') // Trim hyphens from end
}

export function getColorStatus(status: string): string {
  const statusInt = parseInt(status, 10)

  if (statusInt >= 200 && statusInt < 300) {
    // Green for 2xx status codes
    return `\x1b[32m${status}\x1b[0m`
  } else if (statusInt >= 300 && statusInt < 400) {
    // Yellow (often used for orange/warning) for 3xx status codes
    return `\x1b[33m${status}\x1b[0m` // 33 is yellow, often appears orange
  } else if (statusInt >= 400 && statusInt < 600) {
    // Red for 4xx and 5xx status codes
    return `\x1b[31m${status}\x1b[0m`
  }
  // Default to no color for other status codes
  return status
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(price)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
export const calculateDiscount = (originalPrice: number, sale: Sale) => {
  if (sale.type === 'PERCENTAGE') {
    return originalPrice - originalPrice * (sale.value / 100)
  }
  if (sale.type === 'FIXED') {
    return originalPrice - sale.value
  }
  return originalPrice
}

export const calculateDiscountPercentage = (
  originalPrice: number,
  discountedPrice: number
): number => {
  if (originalPrice <= 0) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}
