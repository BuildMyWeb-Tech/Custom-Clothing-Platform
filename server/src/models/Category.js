import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, lowercase: true, trim: true },
  label: { type: String, required: true, trim: true },
  icon: { type: String, default: '👕' },
  basePrice: { type: Number, required: true, min: 0 },
  modelFile: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  availableZones: { type: [String], default: ['body'] },
  description: { type: String, default: '' },
  stockCount: { type: Number, default: 100 },
  lowStockThreshold: { type: Number, default: 10 },
}, { timestamps: true })

export default mongoose.model('Category', categorySchema)
