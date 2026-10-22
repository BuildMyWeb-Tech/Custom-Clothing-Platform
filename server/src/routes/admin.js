import { Router } from 'express'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Category from '../models/Category.js'
import Color from '../models/Color.js'
import Fabric from '../models/Fabric.js'
import Coupon from '../models/Coupon.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.use(protect, adminOnly)

// ─── Stats Overview ─────────────────────────────────────────────────────────

router.get('/stats', async (req, res) => {
  try {
    const [totalOrders, users, revenueAgg, pendingOrders, categories, coupons] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'cutting', 'stitching'] } }),
      Category.countDocuments({ isActive: true }),
      Coupon.countDocuments({ isActive: true }),
    ])
    res.json({
      orders: totalOrders,
      revenue: revenueAgg[0]?.total ?? 0,
      users,
      pending: pendingOrders,
      categories,
      coupons,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Analytics ──────────────────────────────────────────────────────────────

router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query
    const days = parseInt(period) || 30
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [revenueByDay, ordersByStatus, recentOrders] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: since }, paymentStatus: 'paid' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email'),
    ])

    const lowStockCategories = await Category.find({
      $expr: { $lte: ['$stockCount', '$lowStockThreshold'] },
    })

    res.json({ revenueByDay, ordersByStatus, recentOrders, lowStockCategories })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Orders ─────────────────────────────────────────────────────────────────

router.get('/orders', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query
    const filter = {}
    if (status && status !== 'all') filter.status = status
    if (search) filter.$or = [{ _id: { $regex: search, $options: 'i' } }]

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ])
    res.json({ orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const VALID = ['pending', 'confirmed', 'cutting', 'stitching', 'quality_check', 'packed', 'shipped', 'delivered', 'cancelled']
    if (!VALID.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('userId', 'name email')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email phone')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Users / Customers ───────────────────────────────────────────────────────

router.get('/users', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 50 } = req.query
    const filter = {}
    if (role && role !== 'all') filter.role = role
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)),
      User.countDocuments(filter),
    ])
    res.json({ users, total })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    const VALID_ROLES = ['customer', 'admin', 'production']
    if (!VALID_ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' })
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot change own role' })
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot delete yourself' })
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Categories ──────────────────────────────────────────────────────────────

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, createdAt: 1 })
    res.json({ categories })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/categories', async (req, res) => {
  try {
    const cat = await Category.create(req.body)
    res.status(201).json({ category: cat })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/categories/:id', async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!cat) return res.status(404).json({ message: 'Category not found' })
    res.json({ category: cat })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Category deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Colors ──────────────────────────────────────────────────────────────────

router.get('/colors', async (req, res) => {
  try {
    const colors = await Color.find().sort({ sortOrder: 1, createdAt: 1 })
    res.json({ colors })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/colors', async (req, res) => {
  try {
    const color = await Color.create(req.body)
    res.status(201).json({ color })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/colors/:id', async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!color) return res.status(404).json({ message: 'Color not found' })
    res.json({ color })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/colors/:id', async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id)
    res.json({ message: 'Color deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Fabrics ─────────────────────────────────────────────────────────────────

router.get('/fabrics', async (req, res) => {
  try {
    const fabrics = await Fabric.find().sort({ sortOrder: 1, createdAt: 1 })
    res.json({ fabrics })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/fabrics', async (req, res) => {
  try {
    const fabric = await Fabric.create(req.body)
    res.status(201).json({ fabric })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/fabrics/:id', async (req, res) => {
  try {
    const fabric = await Fabric.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!fabric) return res.status(404).json({ message: 'Fabric not found' })
    res.json({ fabric })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/fabrics/:id', async (req, res) => {
  try {
    await Fabric.findByIdAndDelete(req.params.id)
    res.json({ message: 'Fabric deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Coupons ─────────────────────────────────────────────────────────────────

router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json({ coupons })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/coupons', async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json({ coupon })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.json({ coupon })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/coupons/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id)
    res.json({ message: 'Coupon deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
