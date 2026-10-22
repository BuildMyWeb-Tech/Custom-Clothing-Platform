import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import api from '@/utils/api'
import { formatPrice } from '@/utils/pricing'
import type { Order } from '@/types'

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  cutting: { label: 'Cutting Fabric', icon: Package, color: 'text-brand-400', bg: 'bg-brand-400/10' },
  stitching: { label: 'Stitching', icon: Package, color: 'text-brand-400', bg: 'bg-brand-400/10' },
  quality_check: { label: 'Quality Check', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  packed: { label: 'Packed', icon: Package, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
}

const PROGRESS_STEPS = ['confirmed', 'cutting', 'stitching', 'quality_check', 'packed', 'shipped', 'delivered']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 mb-2">No orders yet</p>
            <p className="text-zinc-600 text-sm mb-6">Design your first custom garment to get started</p>
            <Link to="/designer" className="btn-primary">Open 3D Studio</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, i) => {
              const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
              const StatusIcon = status.icon
              const progressIdx = PROGRESS_STEPS.indexOf(order.status)

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-zinc-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {progressIdx >= 0 && (
                    <div className="mb-4">
                      <div className="flex gap-0.5">
                        {PROGRESS_STEPS.map((s, idx) => (
                          <div
                            key={s}
                            className={`flex-1 h-1.5 rounded-full transition-all ${idx <= progressIdx ? 'bg-brand-500' : 'bg-zinc-800'}`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-zinc-600">Confirmed</span>
                        <span className="text-[10px] text-zinc-600">Delivered</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                      <p className="font-semibold text-brand-400 text-lg mt-0.5">{formatPrice(order.totalAmount)}</p>
                    </div>
                    {order.trackingNumber && (
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Tracking</p>
                        <p className="text-sm text-brand-300 font-mono">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
