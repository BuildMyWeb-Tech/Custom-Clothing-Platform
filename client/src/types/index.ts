export type ClothingCategory = 'tshirt' | 'shirt' | 'hoodie' | 'blazer' | 'trousers' | 'jacket'

export interface ColorOption {
  id: string
  name: string
  hex: string
  metallic?: boolean
}

export interface FabricOption {
  id: string
  name: string
  description: string
  priceMultiplier: number
  roughness: number
  metalness: number
  textureUrl?: string
  normalUrl?: string
}

export interface PatternOption {
  id: string
  name: string
  previewUrl: string
  textureUrl: string
}

export type GarmentZone =
  | 'body'
  | 'collar'
  | 'cuffs'
  | 'sleeves'
  | 'buttons'
  | 'pockets'
  | 'stitching'
  | 'inner_lining'

export interface ZoneColor {
  zone: GarmentZone
  color: ColorOption
}

export interface TextDecal {
  id: string
  text: string
  font: string
  color: string
  size: number
  position: [number, number]
  rotation: number
  zone: 'front' | 'back' | 'left_sleeve' | 'right_sleeve' | 'chest'
}

export interface ImageDecal {
  id: string
  url: string
  position: [number, number]
  size: number
  rotation: number
  opacity: number
  zone: 'front' | 'back' | 'left_sleeve' | 'right_sleeve' | 'chest'
}

export interface DesignConfig {
  id?: string
  category: ClothingCategory
  fabric: FabricOption
  pattern?: PatternOption
  zoneColors: Record<GarmentZone, ColorOption>
  textDecals: TextDecal[]
  imageDecals: ImageDecal[]
  size: string
  quantity: number
  savedAt?: Date
  name?: string
  previewImageUrl?: string
}

export interface PriceBreakdown {
  basePrice: number
  fabricSurcharge: number
  designSurcharge: number
  quantityDiscount: number
  total: number
}

export interface Product {
  _id: string
  name: string
  category: ClothingCategory
  description: string
  basePrice: number
  images: string[]
  modelUrl?: string
  availableSizes: string[]
  availableFabrics: string[]
  isActive: boolean
  rating: number
  reviewCount: number
}

export interface CartItem {
  id: string
  product: Product
  designConfig: DesignConfig
  priceBreakdown: PriceBreakdown
  quantity: number
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'customer' | 'admin' | 'production'
  avatar?: string
  savedDesigns: DesignConfig[]
  createdAt: string
}

export interface Order {
  _id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cutting' | 'stitching' | 'quality_check' | 'packed' | 'shipped' | 'delivered'
  shippingAddress: Address
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
}
