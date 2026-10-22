import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['customer', 'admin', 'production'], default: 'customer' },
  avatar: String,
  savedDesigns: [{
    name: String,
    category: String,
    fabric: mongoose.Schema.Types.Mixed,
    zoneColors: mongoose.Schema.Types.Mixed,
    textDecals: [mongoose.Schema.Types.Mixed],
    imageDecals: [mongoose.Schema.Types.Mixed],
    size: String,
    quantity: Number,
    previewImageUrl: String,
    savedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('User', userSchema)
