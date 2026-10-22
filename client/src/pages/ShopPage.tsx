import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Star, Wand2, Layers, ShieldCheck, Truck } from 'lucide-react'
import { useCatalog } from '@/hooks/useCatalog'

const CATEGORY_COLORS: Record<string, string> = {
  tshirt: '#1a1a2e', shirt: '#0f3460', hoodie: '#16213e',
  blazer: '#533483', trousers: '#1a1a2e', jacket: '#2d3561',
}

const RATINGS: Record<string, { rating: number; reviews: number; name: string }> = {
  tshirt: { rating: 4.8, reviews: 214, name: 'Classic T-Shirt' },
  shirt: { rating: 4.9, reviews: 156, name: 'Formal Shirt' },
  hoodie: { rating: 4.7, reviews: 98, name: 'Premium Hoodie' },
  blazer: { rating: 4.9, reviews: 72, name: 'Slim Blazer' },
  trousers: { rating: 4.6, reviews: 143, name: 'Chino Trousers' },
  jacket: { rating: 4.8, reviews: 61, name: 'Casual Jacket' },
}

export default function ShopPage() {
  const { categories, fabrics } = useCatalog()
  return (
    <div className="min-h-screen bg-zinc-950 pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full text-sm text-brand-300 mb-6 border border-brand-500/20">
            <Sparkles size={14} />
            Every style customizable in 3D
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Browse <span className="text-gradient">Collection</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Six premium garment styles, each fully customizable in our live 3D studio. Pick your piece, then make it yours.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { icon: ShieldCheck, label: 'Premium Quality' },
              { icon: Truck, label: 'Fast Delivery' },
              { icon: Layers, label: '50+ Fabrics' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Icon size={13} className="text-brand-400" />
                  {item.label}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Garment grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((cat: any, i: number) => {
            const color = CATEGORY_COLORS[cat.id] ?? '#1a1a2e'
            const meta = RATINGS[cat.id] ?? { rating: 4.8, reviews: 50, name: cat.label }
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/designer?category=${cat.id}`}
                  className="group block glass-dark rounded-3xl overflow-hidden border border-white/5 hover:border-brand-500/30 transition-all duration-300"
                >
                  <div
                    className="h-48 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${color}cc, #0a0a0f)` }}
                  >
                    <span className="text-8xl group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                      {cat.icon}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 right-3 glass-dark px-2 py-1 rounded-lg text-xs text-brand-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Customize <ArrowRight size={10} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white mb-1">{meta.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-zinc-400">{meta.rating}</span>
                      </div>
                      <span className="text-xs text-zinc-600">({meta.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-400 font-bold text-lg">
                        from ₹{cat.basePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-zinc-500 bg-zinc-800/80 px-2 py-1 rounded-lg">
                        Fully custom
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Fabrics section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Premium <span className="text-gradient">Fabrics</span></h2>
          <p className="text-zinc-500 text-sm mb-6">Sourced from the finest mills — choose when you design.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fabrics.slice(0, 4).map((fabric: any, i: number) => (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="card p-4"
              >
                <h4 className="font-medium text-white text-sm mb-1">{fabric.name}</h4>
                <p className="text-xs text-zinc-500 mb-2">{fabric.description}</p>
                {fabric.priceMultiplier > 1 && (
                  <span className="text-xs text-amber-400">+{Math.round((fabric.priceMultiplier - 1) * 100)}% price</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-dark rounded-3xl p-10 border border-brand-500/15 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-transparent" />
          <div className="relative z-10">
            <Sparkles size={28} className="text-brand-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">Start Designing Now</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Open the 3D studio and see your creation come to life in real time.
            </p>
            <Link to="/designer" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
              <Wand2 size={18} />
              Launch 3D Studio
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
