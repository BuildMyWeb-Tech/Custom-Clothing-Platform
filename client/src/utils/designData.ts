import type { ColorOption, FabricOption, PatternOption, ClothingCategory } from '@/types'

export const COLORS: ColorOption[] = [
  { id: 'white', name: 'Pure White', hex: '#FFFFFF' },
  { id: 'ivory', name: 'Ivory', hex: '#FFFFF0' },
  { id: 'cream', name: 'Cream', hex: '#FFFDD0' },
  { id: 'black', name: 'Jet Black', hex: '#0A0A0A' },
  { id: 'charcoal', name: 'Charcoal', hex: '#36454F' },
  { id: 'navy', name: 'Navy Blue', hex: '#001F5B' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#4169E1' },
  { id: 'sky', name: 'Sky Blue', hex: '#87CEEB' },
  { id: 'teal', name: 'Teal', hex: '#008080' },
  { id: 'emerald', name: 'Emerald', hex: '#50C878' },
  { id: 'forest', name: 'Forest Green', hex: '#228B22' },
  { id: 'olive', name: 'Olive', hex: '#808000' },
  { id: 'burgundy', name: 'Burgundy', hex: '#800020' },
  { id: 'crimson', name: 'Crimson', hex: '#DC143C' },
  { id: 'coral', name: 'Coral', hex: '#FF6B6B' },
  { id: 'peach', name: 'Peach', hex: '#FFDAB9' },
  { id: 'gold', name: 'Gold', hex: '#FFD700' },
  { id: 'mustard', name: 'Mustard', hex: '#FFDB58' },
  { id: 'orange', name: 'Burnt Orange', hex: '#CC5500' },
  { id: 'purple', name: 'Royal Purple', hex: '#7851A9' },
  { id: 'lavender', name: 'Lavender', hex: '#E6E6FA' },
  { id: 'pink', name: 'Rose Pink', hex: '#FF66B2' },
  { id: 'brown', name: 'Chocolate', hex: '#7B3F00' },
  { id: 'camel', name: 'Camel', hex: '#C19A6B' },
  { id: 'silver', name: 'Silver', hex: '#C0C0C0', metallic: true },
  { id: 'rose-gold', name: 'Rose Gold', hex: '#B76E79', metallic: true },
]

export const FABRICS: FabricOption[] = [
  {
    id: 'cotton',
    name: 'Premium Cotton',
    description: '100% Egyptian cotton, 180 GSM — breathable & soft',
    priceMultiplier: 1,
    roughness: 0.85,
    metalness: 0,
  },
  {
    id: 'linen',
    name: 'Pure Linen',
    description: 'Natural linen, 160 GSM — lightweight & textured',
    priceMultiplier: 1.3,
    roughness: 0.9,
    metalness: 0,
  },
  {
    id: 'oxford',
    name: 'Oxford Weave',
    description: 'Oxford cotton, 200 GSM — structured & durable',
    priceMultiplier: 1.45,
    roughness: 0.75,
    metalness: 0,
  },
  {
    id: 'twill',
    name: 'Cotton Twill',
    description: 'Diagonal weave, 220 GSM — wrinkle resistant',
    priceMultiplier: 1.5,
    roughness: 0.7,
    metalness: 0,
  },
  {
    id: 'poplin',
    name: 'Poplin',
    description: 'Fine weave, 110 GSM — crisp & formal',
    priceMultiplier: 1.35,
    roughness: 0.65,
    metalness: 0,
  },
  {
    id: 'silk',
    name: 'Silk Blend',
    description: '60% silk, 40% cotton — luxurious drape',
    priceMultiplier: 2.8,
    roughness: 0.3,
    metalness: 0.05,
  },
  {
    id: 'wool',
    name: 'Merino Wool',
    description: '100% Merino wool — premium warmth',
    priceMultiplier: 3.5,
    roughness: 0.95,
    metalness: 0,
  },
  {
    id: 'fleece',
    name: 'Polar Fleece',
    description: 'Synthetic fleece — ultra-soft & warm',
    priceMultiplier: 1.2,
    roughness: 0.98,
    metalness: 0,
  },
  {
    id: 'denim',
    name: 'Japanese Denim',
    description: '12oz selvedge denim — structured & iconic',
    priceMultiplier: 2,
    roughness: 0.9,
    metalness: 0,
  },
]

export const PATTERNS: PatternOption[] = [
  { id: 'solid', name: 'Solid', previewUrl: '', textureUrl: '' },
  { id: 'stripes', name: 'Classic Stripes', previewUrl: '', textureUrl: '' },
  { id: 'checks', name: 'Gingham Check', previewUrl: '', textureUrl: '' },
  { id: 'plaid', name: 'Tartan Plaid', previewUrl: '', textureUrl: '' },
  { id: 'herringbone', name: 'Herringbone', previewUrl: '', textureUrl: '' },
  { id: 'dots', name: 'Polka Dots', previewUrl: '', textureUrl: '' },
  { id: 'floral', name: 'Floral Print', previewUrl: '', textureUrl: '' },
  { id: 'abstract', name: 'Abstract', previewUrl: '', textureUrl: '' },
]

export const CLOTHING_CATEGORIES: { id: ClothingCategory; label: string; icon: string; basePrice: number }[] = [
  { id: 'tshirt', label: 'T-Shirt', icon: '👕', basePrice: 599 },
  { id: 'shirt', label: 'Shirt', icon: '👔', basePrice: 1299 },
  { id: 'hoodie', label: 'Hoodie', icon: '🧥', basePrice: 1799 },
  { id: 'blazer', label: 'Blazer', icon: '🧣', basePrice: 4999 },
  { id: 'trousers', label: 'Trousers', icon: '👖', basePrice: 2499 },
  { id: 'jacket', label: 'Jacket', icon: '🥼', basePrice: 3999 },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

export const FONTS = [
  'Inter', 'Playfair Display', 'Roboto', 'Montserrat', 'Lato',
  'Oswald', 'Raleway', 'Poppins', 'Dancing Script', 'Pacifico',
]
