import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/pricing'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { CLOTHING_CATEGORIES } from '@/utils/designData'

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-premium"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-brand-400" />
                <h2 className="font-semibold text-white">Your Cart</h2>
                {items.length > 0 && (
                  <span className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button onClick={toggleCart} className="btn-ghost">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                  <ShoppingCart size={48} className="text-zinc-700" />
                  <div>
                    <p className="text-zinc-300 font-medium">Your cart is empty</p>
                    <p className="text-zinc-600 text-sm mt-1">Design your perfect garment to get started</p>
                  </div>
                  <Link to="/designer" onClick={toggleCart} className="btn-primary text-sm">
                    Start Designing
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {items.map((item) => {
                    const catInfo = CLOTHING_CATEGORIES.find((c) => c.id === item.designConfig.category)
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4"
                      >
                        <div className="flex gap-3">
                          {/* Color preview */}
                          <div
                            className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl border border-zinc-700"
                            style={{ background: item.designConfig.zoneColors.body?.hex ?? '#333' }}
                          >
                            {catInfo?.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-white text-sm">Custom {catInfo?.label}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{item.designConfig.fabric.name} · Size {item.designConfig.size}</p>
                                {item.designConfig.textDecals.length > 0 && (
                                  <p className="text-xs text-zinc-600 mt-0.5">+{item.designConfig.textDecals.length} text, {item.designConfig.imageDecals.length} images</p>
                                )}
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-zinc-600 hover:text-red-400 transition-colors ml-2"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className="text-white text-sm font-medium w-5 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                                >
                                  <Plus size={11} />
                                </button>
                              </div>
                              <span className="text-brand-400 font-semibold text-sm">
                                {formatPrice(item.priceBreakdown.total * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-zinc-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(total())}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Shipping calculated at checkout</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="btn-primary w-full justify-between"
                >
                  <span>Checkout</span>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-200 font-semibold">{formatPrice(total())}</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
