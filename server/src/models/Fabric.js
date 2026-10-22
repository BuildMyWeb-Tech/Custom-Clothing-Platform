import mongoose from 'mongoose'

const fabricSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  priceMultiplier: { type: Number, default: 1, min: 0.1 },
  roughness: { type: Number, default: 0.8, min: 0, max: 1 },
  metalness: { type: Number, default: 0, min: 0, max: 1 },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Fabric', fabricSchema)
