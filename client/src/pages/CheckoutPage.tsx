import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Truck, CheckCircle, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/utils/pricing'
import { CLOTHING_CATEGORIES } from '@/utils/designData'
import api from '@/utils/api'
import toast from 'react-hot-toast'
import type { Address } from '@/types'

type Step = 'cart' | 'address' | 'payment' | 'success'

const INITIAL_ADDRESS: Address = {
  fullName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'India', phone: '',
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('cart')
  const [address, setAddress] = useState<Address>(INITIAL_ADDRESS)
  const [isLoading, setIsLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 pt-20">
        <ShoppingCart size={48} className="text-zinc-700" />
        <p className="text-zinc-400">Your cart is empty</p>
        <Link to="/designer" className="btn-primary">Start Designing</Link>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (!user) { toast.error('Please sign in to place an order'); navigate('/login'); return }
    setIsLoading(true)
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({
          productId: i.product._id,
          designConfig: i.designConfig,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        paymentMethod: 'cod',
      })
      setOrderId(data.order._id)
      clearCart()
      setStep('success')
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/shop" className="btn-ghost inline-flex mb-8">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        {/* Steps */}
        {step !== 'success' && (
          <div className="flex items-center gap-4 mb-10">
            {(['cart', 'address', 'payment'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === s ? 'bg-brand-600 text-white shadow-glow' : i < ['cart','address','payment'].indexOf(step) ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                  {i < ['cart','address','payment'].indexOf(step) ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-sm capitalize ${step === s ? 'text-white' : 'text-zinc-600'}`}>{s}</span>
                {i < 2 && <div className="w-8 h-px bg-zinc-800 ml-1" />}
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {step === 'cart' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-6">Review Order</h2>
                {items.map((item) => {
                  const cat = CLOTHING_CATEGORIES.find((c) => c.id === item.designConfig.category)
                  return (
                    <div key={item.id} className="card p-5 flex gap-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ background: item.designConfig.zoneColors.body?.hex ?? '#333' }}>
                        {cat?.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">Custom {cat?.label}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{item.designConfig.fabric.name} · {item.designConfig.size} · Qty {item.quantity}</p>
                      </div>
                      <p className="text-brand-400 font-semibold">{formatPrice(item.priceBreakdown.total * item.quantity)}</p>
                    </div>
                  )
                })}
                <button onClick={() => setStep('address')} className="btn-primary w-full justify-center mt-4">
                  Continue to Shipping <ArrowLeft size={16} className="rotate-180" />
                </button>
              </motion.div>
            )}

            {step === 'address' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Truck size={20} className="text-brand-400" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs text-zinc-500 mb-1 block">Full Name *</label>
                    <input className="input" value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} placeholder="John Doe" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-zinc-500 mb-1 block">Address Line 1 *</label>
                    <input className="input" value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})} placeholder="Street, Building, Floor" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-zinc-500 mb-1 block">Address Line 2</label>
                    <input className="input" value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})} placeholder="Landmark (optional)" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">City *</label>
                    <input className="input" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="Mumbai" required />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">State *</label>
                    <input className="input" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} placeholder="Maharashtra" required />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">PIN Code *</label>
                    <input className="input" value={address.zip} onChange={(e) => setAddress({...address, zip: e.target.value})} placeholder="400001" required />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Phone *</label>
                    <input className="input" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} placeholder="+91 98765 43210" required />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('cart')} className="btn-secondary">Back</button>
                  <button
                    onClick={() => {
                      if (!address.fullName || !address.line1 || !address.city) { toast.error('Please fill all required fields'); return }
                      setStep('payment')
                    }}
                    className="btn-primary flex-1 justify-center"
                  >
                    Continue to Payment <ArrowLeft size={16} className="rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-brand-400" /> Payment
                </h2>
                <div className="card p-5 border-brand-500/30 bg-brand-600/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
                      <Truck size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Cash on Delivery</p>
                      <p className="text-xs text-zinc-500">Pay when your order arrives</p>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded-full bg-brand-600 border-2 border-brand-400" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('address')} className="btn-secondary">Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="btn-primary flex-1 justify-center shadow-glow"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Place Order'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle size={40} className="text-emerald-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
                <p className="text-zinc-500 mb-2">Your custom garment is now in production.</p>
                <p className="text-xs text-zinc-600 mb-8">Order ID: {orderId}</p>
                <div className="flex gap-3 justify-center">
                  <Link to="/orders" className="btn-secondary">Track Order</Link>
                  <Link to="/designer" className="btn-primary shadow-glow">Design More</Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step !== 'success' && (
            <div>
              <div className="card p-5 sticky top-24">
                <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {items.map((item) => {
                    const cat = CLOTHING_CATEGORIES.find((c) => c.id === item.designConfig.category)
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-zinc-400">{cat?.label} × {item.quantity}</span>
                        <span className="text-zinc-200">{formatPrice(item.priceBreakdown.total * item.quantity)}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-brand-400 text-lg">{formatPrice(total())}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-2 text-center">Free shipping on orders above ₹2,999</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
