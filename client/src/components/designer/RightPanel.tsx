import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Save, Share2, Minus, Plus, ChevronDown, Sparkles } from 'lucide-react'
import { useDesignStore } from '@/store/designStore'
import { useCartStore } from '@/store/cartStore'
import { calculatePrice, formatPrice } from '@/utils/pricing'
import { CLOTHING_CATEGORIES } from '@/utils/designData'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

export function RightPanel() {
  const [isExpanded, setIsExpanded] = useState(true)

  const {
    category, fabric, zoneColors, textDecals, imageDecals,
    size, quantity, setQuantity, getDesignConfig,
  } = useDesignStore()

  const addItem = useCartStore((s) => s.addItem)
  const toggleCart = useCartStore((s) => s.toggleCart)

  const designConfig = getDesignConfig()
  const price = calculatePrice(designConfig)

  const categoryInfo = CLOTHING_CATEGORIES.find((c) => c.id === category)

  const handleAddToCart = () => {
    const item = {
      id: uuidv4(),
      product: {
        _id: category,
        name: categoryInfo?.label ?? 'Custom Garment',
        category,
        description: `Custom ${categoryInfo?.label}`,
        basePrice: categoryInfo?.basePrice ?? 999,
        images: [],
        availableSizes: [],
        availableFabrics: [],
        isActive: true,
        rating: 5,
        reviewCount: 0,
      },
      designConfig,
      priceBreakdown: price,
      quantity,
    }
    addItem(item)
    toast.success('Added to cart!', { icon: '🛒' })
    setTimeout(() => toggleCart(), 300)
  }

  const zones = Object.entries(zoneColors).filter(([, c]) => c)

  return (
    <div className="panel w-72 flex flex-col h-full overflow-hidden border-l border-zinc-800/60 border-r-0">
      <div className="p-4 border-b border-zinc-800/60">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-semibold text-white text-lg">{categoryInfo?.label}</h3>
          <span className="text-2xl">{categoryInfo?.icon}</span>
        </div>
        <p className="text-xs text-zinc-500">Custom {fabric.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
        {/* Price Breakdown */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            <span className="font-medium">Price Breakdown</span>
            <ChevronDown size={14} className={clsx('transition-transform', isExpanded && 'rotate-180')} />
          </button>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }} animate={{ height: 'auto' }}
              className="px-3 pb-3 space-y-1.5 border-t border-zinc-800"
            >
              <div className="flex justify-between text-xs pt-2">
                <span className="text-zinc-500">Base price</span>
                <span className="text-zinc-300">{formatPrice(price.basePrice)}</span>
              </div>
              {price.fabricSurcharge > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Fabric ({fabric.name})</span>
                  <span className="text-amber-400">+{formatPrice(price.fabricSurcharge)}</span>
                </div>
              )}
              {price.designSurcharge > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Design elements</span>
                  <span className="text-amber-400">+{formatPrice(price.designSurcharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Quantity × {quantity}</span>
                <span className="text-zinc-300">×{quantity}</span>
              </div>
              {price.quantityDiscount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Bulk discount</span>
                  <span className="text-emerald-400">−{formatPrice(price.quantityDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-zinc-800 mt-2">
                <span className="text-white">Total</span>
                <span className="text-brand-400 text-lg">{formatPrice(price.total)}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Design Summary */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Design Summary</p>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Fabric</span>
              <span className="text-zinc-200">{fabric.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Size</span>
              <span className="text-zinc-200">{size}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Text elements</span>
              <span className="text-zinc-200">{textDecals.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Image elements</span>
              <span className="text-zinc-200">{imageDecals.length}</span>
            </div>
          </div>

          {/* Zone colors preview */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-3">
            <p className="text-xs text-zinc-500 mb-2">Zone Colors</p>
            <div className="flex flex-wrap gap-1.5">
              {zones.map(([zone, color]) => (
                <div key={zone} className="flex items-center gap-1" title={zone}>
                  <div className="w-4 h-4 rounded-full border border-zinc-600" style={{ background: color.hex }} />
                  <span className="text-[10px] text-zinc-500 capitalize">{zone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Quantity</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <Minus size={14} className="text-white" />
            </button>
            <span className="text-white font-semibold text-lg w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
            >
              <Plus size={14} className="text-white" />
            </button>
            {quantity >= 3 && (
              <span className="text-xs text-emerald-400 ml-1">
                {quantity >= 10 ? '15%' : quantity >= 5 ? '8%' : '4%'} off
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2 border-t border-zinc-800/60">
        <button
          onClick={handleAddToCart}
          className="btn-primary w-full justify-center text-sm"
        >
          <ShoppingCart size={16} />
          Add to Cart — {formatPrice(price.total)}
        </button>

        <div className="flex gap-2">
          <button className="btn-secondary flex-1 justify-center text-xs">
            <Save size={14} />
            Save Design
          </button>
          <button className="btn-ghost px-3">
            <Heart size={16} />
          </button>
          <button className="btn-ghost px-3">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
