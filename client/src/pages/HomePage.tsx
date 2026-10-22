import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Star, Sparkles, Layers, Zap, Shield, ChevronRight,
  Palette, Ruler, Package, Truck, Award, Clock, Users, TrendingUp,
  Wand2, ShoppingBag, CheckCircle2,
} from 'lucide-react'
import { CLOTHING_CATEGORIES } from '@/utils/designData'

const HERO_STATS = [
  { value: '10,000+', label: 'Designs Created', icon: Wand2 },
  { value: '99.2%', label: 'Satisfaction Rate', icon: Award },
  { value: '48h', label: 'Production Time', icon: Clock },
  { value: '50+', label: 'Fabric Options', icon: Layers },
]

const FEATURES = [
  {
    icon: Layers,
    title: '3D Real-Time Preview',
    description: 'See every color, fabric, and design change instantly on a photorealistic 3D model — no guesswork.',
    badge: 'Live Preview',
  },
  {
    icon: Zap,
    title: 'Instant Customization',
    description: 'Change colors, add text, upload logos — all with live preview and zero lag from our studio.',
    badge: 'Zero Lag',
  },
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Hand-crafted by expert tailors using only the finest imported fabrics sourced globally.',
    badge: 'Expert Made',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: '48-hour production with express shipping. Your custom garment arrives in record time.',
    badge: '48h Ready',
  },
  {
    icon: Palette,
    title: '26 Premium Colors',
    description: 'From classic white to metallic rose gold — choose from our curated palette of premium shades.',
    badge: 'Curated',
  },
  {
    icon: Ruler,
    title: 'Perfect Fit Sizing',
    description: 'XS to 4XL with custom measurements available. Every garment is cut precisely to your size.',
    badge: 'Custom Fit',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: ShoppingBag,
    title: 'Choose Your Garment',
    description: 'Pick from T-shirts, shirts, hoodies, blazers, trousers, or jackets.',
  },
  {
    step: '02',
    icon: Wand2,
    title: 'Design in 3D Studio',
    description: 'Customize colors, fabrics, and add text or images live in our 3D preview.',
  },
  {
    step: '03',
    icon: Package,
    title: 'Order & Receive',
    description: 'Add to cart, checkout, and your bespoke garment ships within 48 hours.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Arjun Kumar',
    role: 'Fashion Designer',
    text: 'The 3D studio is mind-blowing. I could see exactly how my design would look before ordering. Absolutely premium experience.',
    rating: 5,
    initials: 'AK',
  },
  {
    name: 'Priya Sharma',
    role: 'Brand Manager',
    text: 'Ordered 50 custom hoodies for our team. The quality exceeded all expectations. Will definitely order again.',
    rating: 5,
    initials: 'PS',
  },
  {
    name: 'Vikram Mehta',
    role: 'Entrepreneur',
    text: 'The fabric textures and colors in the studio are incredibly accurate to the real product. Saved me so much time.',
    rating: 5,
    initials: 'VM',
  },
]

// Icon for each category (emoji → styled text icons)
const CATEGORY_GRADIENT: Record<string, string> = {
  tshirt:   'from-brand-900/60 to-zinc-950',
  shirt:    'from-blue-900/60 to-zinc-950',
  hoodie:   'from-purple-900/60 to-zinc-950',
  blazer:   'from-amber-900/60 to-zinc-950',
  trousers: 'from-emerald-900/60 to-zinc-950',
  jacket:   'from-red-900/60 to-zinc-950',
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="min-h-screen bg-zinc-950 overflow-x-hidden">
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-zinc-950 to-zinc-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-900/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full text-sm text-brand-300 mb-6 border border-brand-500/20"
          >
            <Sparkles size={14} />
            India's First Real-Time 3D Fashion Studio
            <ChevronRight size={14} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance text-white"
          >
            Design Clothes That{' '}
            <span className="text-gradient">Define You</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 text-balance"
          >
            Create bespoke garments in our photorealistic 3D studio. Choose fabrics, customize every detail, and see your design come to life instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/designer" className="btn-primary text-base px-8 py-4">
              <Wand2 size={18} />
              Open 3D Studio
              <ArrowRight size={18} />
            </Link>
            <Link to="/shop" className="btn-secondary text-base px-8 py-4">
              <ShoppingBag size={18} />
              Browse Collection
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
          >
            {HERO_STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="glass-dark rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-2">
                  <Icon size={16} className="text-brand-400" />
                  <div className="text-2xl font-bold text-gradient font-display">{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                </div>
              )
            })}
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
        >
          <div className="w-5 h-8 rounded-full border-2 border-zinc-700 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1 h-2 bg-brand-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Simple Process
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Three Steps to <span className="text-gradient">Your Design</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">From blank canvas to bespoke garment — faster than you'd think.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-600/40 via-brand-400/60 to-brand-600/40" />

            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative glass-dark rounded-3xl p-8 border border-white/5 text-center group hover:border-brand-500/20 transition-all"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Step {step.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-brand-600/15 border border-brand-500/20 flex items-center justify-center mx-auto mb-5 mt-2 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link to="/designer" className="btn-primary px-8 py-3.5">
              <Wand2 size={16} /> Start Designing Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-widest mb-4">
              <Layers size={12} /> Full Collection
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Choose Your <span className="text-gradient">Garment</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              From classic tees to premium blazers — every piece is fully customizable in our 3D studio.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CLOTHING_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/designer?category=${cat.id}`}
                  className="group flex flex-col items-center p-5 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-brand-500/40 hover:bg-zinc-800/60 transition-all duration-300 text-center"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CATEGORY_GRADIENT[cat.id]} flex items-center justify-center mb-3 text-3xl group-hover:scale-110 transition-transform duration-300 border border-white/5`}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{cat.label}</h3>
                  <p className="text-xs text-zinc-500">from ₹{cat.basePrice.toLocaleString('en-IN')}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Wand2 size={10} /> Design <ArrowRight size={10} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-widest mb-4">
              <Award size={12} /> Why Atelier
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Built for <span className="text-gradient">Perfectionists</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">Every feature designed to give you the most premium custom clothing experience.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-dark rounded-3xl p-7 border border-white/5 hover:border-brand-500/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-brand-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={20} className="text-brand-400" />
                    </div>
                    <span className="text-[10px] font-semibold text-brand-400 bg-brand-600/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-base mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-widest mb-4">
              <Users size={12} /> Customer Stories
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-3xl p-7 border border-white/5 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{t.name}</p>
                    <p className="text-zinc-600 text-xs">{t.role}</p>
                  </div>
                  <CheckCircle2 size={14} className="text-emerald-400 ml-auto flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="py-12 px-4 border-y border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Award, label: 'Premium Quality', sub: 'ISO certified production' },
              { icon: Shield, label: 'Secure Payment', sub: 'SSL encrypted checkout' },
              { icon: Truck, label: 'Fast Shipping', sub: '48h production + delivery' },
              { icon: TrendingUp, label: 'Best Sellers', sub: '10,000+ designs shipped' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                    <Icon size={18} className="text-brand-400" />
                  </div>
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  <p className="text-zinc-600 text-xs">{item.sub}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark rounded-3xl p-12 border border-brand-500/15 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-transparent" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-6">
                <Wand2 size={28} className="text-brand-400" />
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Design?</h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Open the 3D studio and create your perfect garment in minutes. No account required to start.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/designer" className="btn-primary text-base px-10 py-4">
                  <Wand2 size={18} />
                  Launch 3D Studio
                  <ArrowRight size={18} />
                </Link>
                <Link to="/shop" className="btn-secondary text-base px-8 py-4">
                  <ShoppingBag size={18} />
                  View Collection
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white">ATELIER</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                India's premier custom clothing platform with real-time 3D design technology.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Studio</h4>
              <div className="space-y-2">
                {CLOTHING_CATEGORIES.map((c) => (
                  <Link key={c.id} to={`/designer?category=${c.id}`} className="block text-zinc-500 hover:text-white text-sm transition-colors">
                    {c.icon} {c.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">About Us</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Size Guide</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Shipping Policy</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Returns</a>
                <a href="#" className="block text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-800">
            <p className="text-zinc-600 text-sm">© 2026 Atelier. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
