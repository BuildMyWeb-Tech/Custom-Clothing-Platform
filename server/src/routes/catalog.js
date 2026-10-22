import { Router } from 'express'
import Category from '../models/Category.js'
import Color from '../models/Color.js'
import Fabric from '../models/Fabric.js'
import Coupon from '../models/Coupon.js'

const router = Router()

// Public catalog endpoints (no auth required — used by Shop and Designer pages)

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 })
    res.json({ categories })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/colors', async (req, res) => {
  try {
    const colors = await Color.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 })
    res.json({ colors })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/fabrics', async (req, res) => {
  try {
    const fabrics = await Fabric.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 })
    res.json({ fabrics })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Validate and apply a coupon code
router.post('/coupons/validate', async (req, res) => {
  try {
    const { code, orderAmount } = req.body
    if (!code) return res.status(400).json({ message: 'Code required' })

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })
    if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon' })

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ message: 'Coupon has expired' })
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'Coupon usage limit reached' })
    }
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order ₹${coupon.minOrderAmount} required` })
    }

    const discount = coupon.type === 'percentage'
      ? Math.round((orderAmount * coupon.value) / 100)
      : Math.min(coupon.value, orderAmount)

    res.json({ valid: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, discount } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
