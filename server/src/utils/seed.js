import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atelier-clothing'

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  // Clear existing
  await User.deleteMany({})

  const users = [
    { name: 'Admin User', email: 'admin@atelier.com', password: 'Admin@1234', role: 'admin' },
    { name: 'Test Customer', email: 'customer@atelier.com', password: 'Customer@1234', role: 'customer' },
    { name: 'Production Team', email: 'production@atelier.com', password: 'Prod@12345', role: 'production' },
  ]

  for (const u of users) {
    await User.create(u)
  }

  console.log('✅ Seeded users:')
  console.log('  Admin: admin@atelier.com / Admin@1234')
  console.log('  Customer: customer@atelier.com / Customer@1234')
  console.log('  Production: production@atelier.com / Prod@12345')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })
