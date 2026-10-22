import type { DesignConfig, PriceBreakdown } from '@/types'

const BASE_PRICES: Record<string, number> = {
  tshirt: 599,
  shirt: 1299,
  hoodie: 1799,
  blazer: 4999,
  trousers: 2499,
  jacket: 3999,
}

export function calculatePrice(config: DesignConfig): PriceBreakdown {
  const basePrice = BASE_PRICES[config.category] ?? 999
  const fabricSurcharge = Math.round(basePrice * (config.fabric.priceMultiplier - 1))
  const textCount = config.textDecals.length
  const imageCount = config.imageDecals.length
  const designSurcharge = textCount * 50 + imageCount * 100
  const subtotal = basePrice + fabricSurcharge + designSurcharge
  const qty = config.quantity
  const discount = qty >= 10 ? 0.15 : qty >= 5 ? 0.08 : qty >= 3 ? 0.04 : 0
  const quantityDiscount = Math.round(subtotal * discount * qty)
  const total = subtotal * qty - quantityDiscount

  return { basePrice, fabricSurcharge, designSurcharge, quantityDiscount, total }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}
