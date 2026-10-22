import { Router } from 'express'
import Order from '../models/Order.js'
import { protect } from '../middleware/auth.js'

const router = Router()

const BASE_PRICES = { tshirt: 599, shirt: 1299, hoodie: 1799, blazer: 4999, trousers: 2499, jacket: 3999 }

function recalculateTotal(items) {
  return items.reduce((sum, item) => {
    const config = item.designConfig
    const base = BASE_PRICES[config?.category] ?? 999
    const fabricMult = config?.fabric?.priceMultiplier ?? 1
    const fabricSurcharge = Math.round(base * (fabricMult - 1))
    const textCount = config?.textDecals?.length ?? 0
    const imageCount = config?.imageDecals?.length ?? 0
    const designSurcharge = textCount * 50 + imageCount * 100
    const subtotal = base + fabricSurcharge + designSurcharge
    const qty = item.quantity || 1
    const discount = qty >= 10 ? 0.15 : qty >= 5 ? 0.08 : qty >= 3 ? 0.04 : 0
    const quantityDiscount = Math.round(subtotal * discount * qty)
    const total = subtotal * qty - quantityDiscount
    return sum + total
  }, 0)
}

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body
    if (!items?.length) return res.status(400).json({ message: 'No items in order' })
    if (!shippingAddress?.fullName) return res.status(400).json({ message: 'Shipping address required' })

    const totalAmount = recalculateTotal(items)
    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      status: 'confirmed',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    })

    res.status(201).json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
