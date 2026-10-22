import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import catalogRoutes from './routes/catalog.js'
import { seedAdmin, seedCatalog } from './utils/seedAdmin.js'

const app = express()

// Security
app.use(helmet({ crossOriginEmbedderPolicy: false }))
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/catalog', catalogRoutes)

// Health
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }))

// 404
app.use('*', (_, res) => res.status(404).json({ message: 'Not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// Connect DB and start
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atelier-clothing'

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')
    await seedAdmin()
    await seedCatalog()
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
