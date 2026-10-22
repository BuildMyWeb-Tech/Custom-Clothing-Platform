import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, default: 'India' },
  phone: { type: String, required: true },
}, { _id: false })

const orderItemSchema = new mongoose.Schema({
  productId: String,
  designConfig: { type: mongoose.Schema.Types.Mixed, required: true },
  priceBreakdown: {
    basePrice: Number,
    fabricSurcharge: Number,
    designSurcharge: Number,
    quantityDiscount: Number,
    total: Number,
  },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cutting', 'stitching', 'quality_check', 'packed', 'shipped', 'delivered'],
    default: 'pending',
  },
  shippingAddress: { type: addressSchema, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'cod' },
  trackingNumber: String,
  estimatedDelivery: String,
  notes: String,
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
