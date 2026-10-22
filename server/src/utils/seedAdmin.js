import User from '../models/User.js'
import Category from '../models/Category.js'
import Color from '../models/Color.js'
import Fabric from '../models/Fabric.js'

const DEFAULT_CATEGORIES = [
  { id: 'tshirt', label: 'T-Shirt', icon: '👕', basePrice: 599, modelFile: '/models/tshirt.glb', availableZones: ['body', 'left_sleeve', 'right_sleeve'], stockCount: 150, lowStockThreshold: 20 },
  { id: 'shirt', label: 'Shirt', icon: '👔', basePrice: 1299, modelFile: '/models/shirt.glb', availableZones: ['body', 'collar', 'left_sleeve', 'right_sleeve'], stockCount: 100, lowStockThreshold: 15 },
  { id: 'hoodie', label: 'Hoodie', icon: '🧥', basePrice: 1799, modelFile: '/models/full_hoodie.glb', availableZones: ['body', 'hood', 'left_sleeve', 'right_sleeve'], stockCount: 80, lowStockThreshold: 10 },
  { id: 'blazer', label: 'Blazer', icon: '🧣', basePrice: 4999, modelFile: '/models/blazer.glb', availableZones: ['body', 'lapel', 'left_sleeve', 'right_sleeve'], stockCount: 50, lowStockThreshold: 8 },
  { id: 'trousers', label: 'Trousers', icon: '👖', basePrice: 2499, modelFile: '/models/trousers.glb', availableZones: ['body', 'left_leg', 'right_leg'], stockCount: 90, lowStockThreshold: 12 },
  { id: 'jacket', label: 'Jacket', icon: '🥼', basePrice: 3999, modelFile: '/models/full_hoodie.glb', availableZones: ['body', 'left_sleeve', 'right_sleeve'], stockCount: 60, lowStockThreshold: 10 },
]

const DEFAULT_COLORS = [
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
  { id: 'gold', name: 'Gold', hex: '#FFD700' },
  { id: 'purple', name: 'Royal Purple', hex: '#7851A9' },
  { id: 'lavender', name: 'Lavender', hex: '#E6E6FA' },
  { id: 'pink', name: 'Rose Pink', hex: '#FF66B2' },
  { id: 'brown', name: 'Chocolate', hex: '#7B3F00' },
  { id: 'silver', name: 'Silver', hex: '#C0C0C0', metallic: true },
  { id: 'rose-gold', name: 'Rose Gold', hex: '#B76E79', metallic: true },
]

const DEFAULT_FABRICS = [
  { id: 'cotton', name: 'Premium Cotton', description: '100% Egyptian cotton, 180 GSM — breathable & soft', priceMultiplier: 1, roughness: 0.85, metalness: 0 },
  { id: 'linen', name: 'Pure Linen', description: 'Natural linen, 160 GSM — lightweight & textured', priceMultiplier: 1.3, roughness: 0.9, metalness: 0 },
  { id: 'oxford', name: 'Oxford Weave', description: 'Oxford cotton, 200 GSM — structured & durable', priceMultiplier: 1.45, roughness: 0.75, metalness: 0 },
  { id: 'twill', name: 'Cotton Twill', description: 'Diagonal weave, 220 GSM — wrinkle resistant', priceMultiplier: 1.5, roughness: 0.7, metalness: 0 },
  { id: 'poplin', name: 'Poplin', description: 'Fine weave, 110 GSM — crisp & formal', priceMultiplier: 1.35, roughness: 0.65, metalness: 0 },
  { id: 'silk', name: 'Silk Blend', description: '60% silk, 40% cotton — luxurious drape', priceMultiplier: 2.8, roughness: 0.3, metalness: 0.05 },
  { id: 'wool', name: 'Merino Wool', description: '100% Merino wool — premium warmth', priceMultiplier: 3.5, roughness: 0.95, metalness: 0 },
  { id: 'fleece', name: 'Polar Fleece', description: 'Synthetic fleece — ultra-soft & warm', priceMultiplier: 1.2, roughness: 0.98, metalness: 0 },
  { id: 'denim', name: 'Japanese Denim', description: '12oz selvedge denim — structured & iconic', priceMultiplier: 2, roughness: 0.9, metalness: 0 },
]

export async function seedAdmin() {
  try {
    const admin = await User.findOne({ role: 'admin' })
    if (!admin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@atelier.com',
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        role: 'admin',
      })
      console.log('✅ Admin seeded: admin@atelier.com / admin123456')
    }
  } catch (err) {
    console.error('Admin seed error:', err.message)
  }
}

export async function seedCatalog() {
  try {
    const catCount = await Category.countDocuments()
    if (catCount === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES)
      console.log('✅ Categories seeded')
    }
    const colorCount = await Color.countDocuments()
    if (colorCount === 0) {
      await Color.insertMany(DEFAULT_COLORS)
      console.log('✅ Colors seeded')
    }
    const fabricCount = await Fabric.countDocuments()
    if (fabricCount === 0) {
      await Fabric.insertMany(DEFAULT_FABRICS)
      console.log('✅ Fabrics seeded')
    }
  } catch (err) {
    console.error('Catalog seed error:', err.message)
  }
}
