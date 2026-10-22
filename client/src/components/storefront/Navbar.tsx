import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, Sparkles, Search, Home, ShoppingBag, Wand2, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { clsx } from 'clsx'

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/designer', label: 'Studio', icon: Wand2 },
  { href: '/orders', label: 'Orders', icon: Package },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const itemCount = useCartStore((s) => s.itemCount())
  const toggleCart = useCartStore((s) => s.toggleCart)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isDesigner = location.pathname === '/designer'
  if (isDesigner) return null

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          scrolled
            ? 'glass-dark shadow-premium py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              ATELIER
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              const active = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={clsx(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                    active ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon size={15} className={active ? 'text-brand-400' : ''} />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="btn-ghost hidden md:flex">
              <Search size={18} />
            </button>

            <button
              onClick={toggleCart}
              className="relative btn-ghost"
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] px-1"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {user ? (
              <Link to="/account" className="btn-ghost">
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name[0].toUpperCase()}
                </div>
              </Link>
            ) : (
              <Link to="/login" className="btn-secondary text-sm px-4 py-2 hidden md:flex">
                Sign In
              </Link>
            )}

            <Link
              to="/designer"
              className="btn-primary text-sm px-4 py-2 hidden md:flex shadow-glow"
            >
              <Sparkles size={14} />
              Design Now
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-ghost md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-30 glass-dark border-t border-white/5 md:hidden"
          >
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Icon size={16} className="text-brand-400" />
                    {link.label}
                  </Link>
                )
              })}
              <Link
                to="/designer"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center mt-2"
              >
                <Sparkles size={14} />
                Start Designing
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
