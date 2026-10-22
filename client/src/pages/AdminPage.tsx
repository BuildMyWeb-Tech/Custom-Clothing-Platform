import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Users, BarChart2, Tag, Settings,
  LogOut, Menu, X, Shirt, Palette, Layers, TrendingUp, Package,
  Clock, AlertTriangle, Plus, Edit2, Trash2,
  Search, ChevronRight,
  Sparkles, RefreshCw, ToggleLeft, ToggleRight,
  DollarSign, Calendar, Save, XCircle, Shield, Eye,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { clsx } from 'clsx'

const API = axios.create({ baseURL: 'http://localhost:5000/api', withCredentials: true })

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category { _id: string; id: string; label: string; icon: string; basePrice: number; modelFile: string; isActive: boolean; sortOrder: number; availableZones: string[]; description: string; stockCount: number; lowStockThreshold: number }
interface Color { _id: string; id: string; name: string; hex: string; metallic: boolean; isActive: boolean; sortOrder: number }
interface Fabric { _id: string; id: string; name: string; description: string; priceMultiplier: number; roughness: number; metalness: number; isActive: boolean; sortOrder: number }
interface Coupon { _id: string; code: string; type: 'percentage' | 'fixed'; value: number; minOrderAmount: number; maxUses: number | null; usedCount: number; isActive: boolean; expiresAt: string | null; description: string }
interface Order { _id: string; status: string; totalAmount: number; paymentStatus: string; paymentMethod: string; createdAt: string; userId?: { name: string; email: string }; items: any[]; shippingAddress: any }
interface Customer { _id: string; name: string; email: string; role: string; createdAt: string }

type AdminSection = 'overview' | 'orders' | 'products' | 'colors' | 'fabrics' | 'customers' | 'analytics' | 'coupons' | 'settings'

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  cutting: 'text-orange-400 bg-orange-400/10',
  stitching: 'text-purple-400 bg-purple-400/10',
  quality_check: 'text-cyan-400 bg-cyan-400/10',
  packed: 'text-indigo-400 bg-indigo-400/10',
  shipped: 'text-teal-400 bg-teal-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
}

const ORDER_STATUSES = ['pending', 'confirmed', 'cutting', 'stitching', 'quality_check', 'packed', 'shipped', 'delivered', 'cancelled']

// ─── Admin Login Page ─────────────────────────────────────────────────────────

function AdminLoginPage() {
  const [form, setForm] = useState({ adminId: '', password: '' })
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.adminId, form.password)
      const user = useAuthStore.getState().user
      if (!user || user.role !== 'admin') {
        logout()
        toast.error('This account does not have admin access.')
        setLoading(false)
        return
      }
      toast.success(`Welcome back, ${user.name}!`)
      navigate('/admin')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-zinc-500 text-sm">ATELIER Control Panel — authorized personnel only</p>
        </div>
        <div className="glass-dark rounded-2xl p-8 border border-white/5">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Admin Email / ID</label>
              <input type="email" required value={form.adminId} onChange={(e) => setForm({ ...form, adminId: e.target.value })} placeholder="admin@atelier.com" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••••" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-colors" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <><RefreshCw size={16} className="animate-spin" /> Verifying…</> : <><Shield size={16} /> Sign In to Admin Panel</>}
            </button>
          </form>
          <p className="text-center text-xs text-zinc-600 mt-6">Default: admin@atelier.com / admin123456</p>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: string | number; icon: any; color: string; sub?: string }) {
  return (
    <div className="glass-dark rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  )
}

// ─── Overview Panel ───────────────────────────────────────────────────────────

function OverviewPanel({ token }: { token: string }) {
  const [stats, setStats] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [s, a] = await Promise.all([
          API.get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          API.get('/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setStats(s.data); setAnalytics(a.data)
      } catch { toast.error('Failed to load stats') }
      finally { setLoading(false) }
    }
    load()
  }, [token])

  if (loading) return <div className="flex items-center justify-center h-64 text-zinc-500"><RefreshCw size={24} className="animate-spin" /></div>

  const byDay = analytics?.revenueByDay ?? []
  const maxRev = Math.max(...byDay.map((d: any) => d.revenue), 1)

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats?.orders ?? 0} icon={Package} color="bg-blue-500/15 text-blue-400" />
        <StatCard label="Revenue" value={`₹${(stats?.revenue ?? 0).toLocaleString('en-IN')}`} icon={TrendingUp} color="bg-green-500/15 text-green-400" />
        <StatCard label="Customers" value={stats?.users ?? 0} icon={Users} color="bg-purple-500/15 text-purple-400" />
        <StatCard label="Pending" value={stats?.pending ?? 0} icon={Clock} color="bg-orange-500/15 text-orange-400" sub="Need action" />
      </div>

      {byDay.length > 0 && (
        <div className="glass-dark rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-5">Revenue — Last 30 Days</h3>
          <div className="flex items-end gap-1 h-28">
            {byDay.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div className="w-full bg-brand-600/60 hover:bg-brand-500 rounded-t transition-colors cursor-default" style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: 4 }} />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">₹{d.revenue.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 mt-2"><span>{byDay[0]?._id}</span><span>{byDay[byDay.length - 1]?._id}</span></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-dark rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Orders by Status</h3>
          <div className="space-y-2">
            {(analytics?.ordersByStatus ?? []).map((s: any) => (
              <div key={s._id} className="flex items-center justify-between">
                <span className={clsx('text-xs px-2 py-0.5 rounded-full', STATUS_COLORS[s._id] ?? 'text-zinc-400 bg-zinc-700/50')}>{s._id}</span>
                <span className="text-sm font-medium text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-dark rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-orange-400" /> Low Stock Alerts</h3>
          {(analytics?.lowStockCategories ?? []).length === 0 ? <p className="text-zinc-500 text-sm">All items well-stocked</p> : (
            <div className="space-y-2">
              {analytics.lowStockCategories.map((c: any) => (
                <div key={c._id} className="flex items-center justify-between bg-orange-500/5 border border-orange-500/20 rounded-xl px-3 py-2">
                  <span className="text-sm text-white">{c.icon} {c.label}</span>
                  <span className="text-xs text-orange-400">{c.stockCount} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-dark rounded-2xl p-6 border border-white/5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-zinc-500 text-xs border-b border-white/5"><th className="text-left pb-3">Order ID</th><th className="text-left pb-3">Customer</th><th className="text-left pb-3">Amount</th><th className="text-left pb-3">Status</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {(analytics?.recentOrders ?? []).map((o: any) => (
                <tr key={o._id} className="hover:bg-white/2">
                  <td className="py-2.5 text-zinc-400 font-mono text-xs">{o._id.slice(-8)}</td>
                  <td className="py-2.5 text-white">{o.userId?.name ?? 'Guest'}</td>
                  <td className="py-2.5 text-brand-400 font-medium">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-2.5"><span className={clsx('text-xs px-2 py-0.5 rounded-full', STATUS_COLORS[o.status] ?? 'text-zinc-400')}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Orders Panel ─────────────────────────────────────────────────────────────

function OrdersPanel({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (search) params.search = search
      const { data } = await API.get('/admin/orders', { headers: { Authorization: `Bearer ${token}` }, params })
      setOrders(data.orders)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }, [token, statusFilter, search])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id)
    try {
      await API.patch(`/admin/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Status updated')
      fetchOrders()
      if (selected?._id === id) setSelected(null)
    } catch { toast.error('Failed to update status') }
    finally { setUpdatingId(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Orders</h2>
        <button onClick={fetchOrders} className="btn-ghost"><RefreshCw size={15} /></button>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order ID…" className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500">
          <option value="all">All Status</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="flex items-center justify-center h-40 text-zinc-500"><RefreshCw size={20} className="animate-spin" /></div> : (
        <div className="overflow-x-auto glass-dark rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead><tr className="text-zinc-500 text-xs border-b border-white/5">
              <th className="text-left p-4">Order ID</th><th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Amount</th><th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th><th className="text-left p-4">Date</th><th className="text-left p-4">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-white/2">
                  <td className="p-4 text-zinc-400 font-mono text-xs">{o._id.slice(-8)}</td>
                  <td className="p-4 text-white">{o.userId?.name ?? 'Guest'}<div className="text-xs text-zinc-500">{o.userId?.email}</div></td>
                  <td className="p-4 text-brand-400 font-semibold">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="p-4"><span className={clsx('text-xs px-2 py-0.5 rounded-full', o.paymentStatus === 'paid' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10')}>{o.paymentStatus}</span></td>
                  <td className="p-4"><span className={clsx('text-xs px-2 py-0.5 rounded-full', STATUS_COLORS[o.status] ?? 'text-zinc-400')}>{o.status}</span></td>
                  <td className="p-4 text-zinc-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(o)} className="btn-ghost p-1.5"><Eye size={13} /></button>
                      <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} disabled={updatingId === o._id} className="bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none">
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-zinc-500">No orders found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-zinc-900 rounded-2xl p-6 w-full max-w-lg border border-white/10 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">Order #{selected._id.slice(-8)}</h3>
                <button onClick={() => setSelected(null)} className="btn-ghost p-1.5"><X size={16} /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Customer</span><span className="text-white">{selected.userId?.name}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Email</span><span className="text-white">{selected.userId?.email}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Total</span><span className="text-brand-400 font-bold">₹{selected.totalAmount?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Payment</span><span className={selected.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}>{selected.paymentStatus}</span></div>
                {selected.shippingAddress && (
                  <div className="mt-3 p-3 bg-zinc-800/60 rounded-xl">
                    <div className="text-xs text-zinc-400 mb-1">Shipping Address</div>
                    <div className="text-white text-xs">{selected.shippingAddress.line1}, {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.pincode}</div>
                  </div>
                )}
                <div className="mt-3">
                  <div className="text-xs text-zinc-400 mb-2">Update Status</div>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_STATUSES.map((s) => (
                      <button key={s} onClick={() => updateStatus(selected._id, s)} disabled={updatingId === selected._id} className={clsx('text-xs px-3 py-1.5 rounded-lg border transition-all', selected.status === s ? 'bg-brand-600 border-brand-500 text-white' : 'border-white/10 text-zinc-400 hover:border-brand-500 hover:text-white')}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Products Panel ───────────────────────────────────────────────────────────

function CategoryForm({ item, onSave, onCancel }: { item?: Category; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState<any>(item ?? { id: '', label: '', icon: '👕', basePrice: 599, modelFile: '', isActive: true, sortOrder: 0, description: '', stockCount: 100, lowStockThreshold: 10 })
  return (
    <div className="glass-dark rounded-2xl p-6 border border-brand-500/20">
      <h3 className="text-base font-semibold text-white mb-5">{item ? 'Edit Category' : 'New Category'}</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'id', label: 'ID (slug)', type: 'text', placeholder: 'tshirt' },
          { key: 'label', label: 'Label', type: 'text', placeholder: 'T-Shirt' },
          { key: 'icon', label: 'Icon (emoji)', type: 'text', placeholder: '👕' },
          { key: 'basePrice', label: 'Base Price (₹)', type: 'number', placeholder: '599' },
          { key: 'stockCount', label: 'Stock Count', type: 'number', placeholder: '100' },
          { key: 'lowStockThreshold', label: 'Low Stock Alert', type: 'number', placeholder: '10' },
          { key: 'sortOrder', label: 'Sort Order', type: 'number', placeholder: '0' },
          { key: 'modelFile', label: '3D Model File', type: 'text', placeholder: '/models/tshirt.glb' },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-zinc-500 mb-1">{label}</label>
            <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })} placeholder={placeholder} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500" />
          </div>
        ))}
        <div className="col-span-2">
          <label className="block text-xs text-zinc-500 mb-1">Description</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500" />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-zinc-400">Active</label>
          <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}>
            {form.isActive ? <ToggleRight size={20} className="text-brand-400" /> : <ToggleLeft size={20} className="text-zinc-600" />}
          </button>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={() => onSave(form)} className="btn-primary flex-1 justify-center"><Save size={14} /> Save</button>
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center"><XCircle size={14} /> Cancel</button>
      </div>
    </div>
  )
}

function ProductsPanel({ token }: { token: string }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null | 'new'>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/admin/categories', { headers: { Authorization: `Bearer ${token}` } })
      setCategories(data.categories)
    } catch { toast.error('Failed to load categories') }
    finally { setLoading(false) }
  }, [token])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  async function save(form: any) {
    try {
      if (editing === 'new') {
        await API.post('/admin/categories', form, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Category created')
      } else if (editing) {
        await API.put(`/admin/categories/${(editing as Category)._id}`, form, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Category updated')
      }
      setEditing(null); fetchCategories()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Save failed') }
  }

  async function remove(id: string) {
    if (!confirm('Delete this category?')) return
    try {
      await API.delete(`/admin/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Deleted'); fetchCategories()
    } catch { toast.error('Delete failed') }
  }

  async function toggle(cat: Category) {
    await API.put(`/admin/categories/${cat._id}`, { ...cat, isActive: !cat.isActive }, { headers: { Authorization: `Bearer ${token}` } })
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Products & Categories</h2>
        <button onClick={() => setEditing('new')} className="btn-primary"><Plus size={15} /> Add Category</button>
      </div>
      {editing && <div className="mb-6"><CategoryForm item={editing === 'new' ? undefined : editing as Category} onSave={save} onCancel={() => setEditing(null)} /></div>}
      {loading ? <div className="flex justify-center py-12 text-zinc-500"><RefreshCw size={20} className="animate-spin" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="glass-dark rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{cat.label}</h3>
                    <span className="text-xs text-zinc-500 font-mono">{cat.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggle(cat)} className="btn-ghost p-1.5">{cat.isActive ? <ToggleRight size={18} className="text-brand-400" /> : <ToggleLeft size={18} className="text-zinc-600" />}</button>
                  <button onClick={() => setEditing(cat)} className="btn-ghost p-1.5"><Edit2 size={14} /></button>
                  <button onClick={() => remove(cat._id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-zinc-800/60 rounded-lg p-2"><div className="text-zinc-500">Price</div><div className="text-brand-400 font-semibold">₹{cat.basePrice}</div></div>
                <div className={clsx('rounded-lg p-2', cat.stockCount <= cat.lowStockThreshold ? 'bg-orange-500/10' : 'bg-zinc-800/60')}>
                  <div className="text-zinc-500">Stock</div>
                  <div className={cat.stockCount <= cat.lowStockThreshold ? 'text-orange-400 font-semibold' : 'text-white font-semibold'}>{cat.stockCount}</div>
                </div>
                <div className="bg-zinc-800/60 rounded-lg p-2"><div className="text-zinc-500">Status</div><div className={cat.isActive ? 'text-green-400' : 'text-red-400'}>{cat.isActive ? 'Active' : 'Hidden'}</div></div>
              </div>
              {cat.description && <p className="text-xs text-zinc-500 mt-3">{cat.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Colors Panel ─────────────────────────────────────────────────────────────

function ColorsPanel({ token }: { token: string }) {
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>({ id: '', name: '', hex: '#000000', metallic: false, isActive: true })
  const [editing, setEditing] = useState<string | null>(null)

  const fetchColors = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/admin/colors', { headers: { Authorization: `Bearer ${token}` } })
      setColors(data.colors)
    } catch { toast.error('Failed to load colors') }
    finally { setLoading(false) }
  }, [token])

  useEffect(() => { fetchColors() }, [fetchColors])

  async function save() {
    try {
      if (editing) {
        await API.put(`/admin/colors/${editing}`, form, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Updated')
      } else {
        await API.post('/admin/colors', form, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Added')
      }
      setEditing(null); setForm({ id: '', name: '', hex: '#000000', metallic: false, isActive: true }); fetchColors()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Save failed') }
  }

  async function remove(id: string) {
    if (!confirm('Delete color?')) return
    try {
      await API.delete(`/admin/colors/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Deleted'); fetchColors()
    } catch { toast.error('Delete failed') }
  }

  function startEdit(c: Color) {
    setEditing(c._id); setForm({ id: c.id, name: c.name, hex: c.hex, metallic: c.metallic, isActive: c.isActive })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Color Management</h2></div>
      <div className="glass-dark rounded-2xl p-5 border border-white/5 mb-6">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">{editing ? 'Edit Color' : 'Add New Color'}</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div><label className="block text-xs text-zinc-500 mb-1">ID</label><input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="royal-blue" className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white w-32 focus:outline-none focus:border-brand-500" /></div>
          <div><label className="block text-xs text-zinc-500 mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Royal Blue" className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white w-36 focus:outline-none focus:border-brand-500" /></div>
          <div><label className="block text-xs text-zinc-500 mb-1">Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.hex} onChange={(e) => setForm({ ...form, hex: e.target.value })} className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
              <input value={form.hex} onChange={(e) => setForm({ ...form, hex: e.target.value })} className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white w-28 focus:outline-none font-mono" />
            </div>
          </div>
          <div className="flex items-center gap-2 pb-1"><input type="checkbox" checked={form.metallic} onChange={(e) => setForm({ ...form, metallic: e.target.checked })} id="metallic" className="accent-brand-500" /><label htmlFor="metallic" className="text-xs text-zinc-400">Metallic</label></div>
          <button onClick={save} className="btn-primary"><Save size={14} /> {editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ id: '', name: '', hex: '#000000', metallic: false, isActive: true }) }} className="btn-secondary"><XCircle size={14} /> Cancel</button>}
        </div>
      </div>
      {loading ? <div className="flex justify-center py-8 text-zinc-500"><RefreshCw size={20} className="animate-spin" /></div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {colors.map((c) => (
            <div key={c._id} className={clsx('glass-dark rounded-2xl p-3 border', c.isActive ? 'border-white/5' : 'border-red-500/20 opacity-60')}>
              <div className="w-full h-12 rounded-xl mb-2 border border-white/10" style={{ background: c.hex }} />
              <div className="text-xs font-medium text-white truncate">{c.name}</div>
              <div className="text-[10px] text-zinc-500 font-mono mb-1">{c.hex}</div>
              {c.metallic && <div className="text-[10px] text-amber-400 mb-1">Metallic</div>}
              <div className="flex gap-1">
                <button onClick={() => startEdit(c)} className="btn-ghost p-1 flex-1"><Edit2 size={11} /></button>
                <button onClick={() => remove(c._id)} className="btn-ghost p-1 text-red-400"><Trash2 size={11} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Fabrics Panel ────────────────────────────────────────────────────────────

function FabricsPanel({ token }: { token: string }) {
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null | 'new'>(null)
  const [form, setForm] = useState<any>({ id: '', name: '', description: '', priceMultiplier: 1, roughness: 0.8, metalness: 0, isActive: true })

  const fetchFabrics = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/admin/fabrics', { headers: { Authorization: `Bearer ${token}` } })
      setFabrics(data.fabrics)
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }, [token])

  useEffect(() => { fetchFabrics() }, [fetchFabrics])

  async function save() {
    try {
      if (editing && editing !== 'new') {
        await API.put(`/admin/fabrics/${editing}`, form, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Updated')
      } else {
        await API.post('/admin/fabrics', form, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Added')
      }
      setEditing(null); setForm({ id: '', name: '', description: '', priceMultiplier: 1, roughness: 0.8, metalness: 0, isActive: true }); fetchFabrics()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Save failed') }
  }

  function startEdit(f: Fabric) {
    setEditing(f._id); setForm({ id: f.id, name: f.name, description: f.description, priceMultiplier: f.priceMultiplier, roughness: f.roughness, metalness: f.metalness, isActive: f.isActive })
  }

  async function remove(id: string) {
    if (!confirm('Delete fabric?')) return
    try {
      await API.delete(`/admin/fabrics/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Deleted'); fetchFabrics()
    } catch { toast.error('Delete failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Fabric Management</h2>
        <button onClick={() => { setEditing('new'); setForm({ id: '', name: '', description: '', priceMultiplier: 1, roughness: 0.8, metalness: 0, isActive: true }) }} className="btn-primary"><Plus size={15} /> Add Fabric</button>
      </div>
      {editing && (
        <div className="glass-dark rounded-2xl p-5 border border-brand-500/20 mb-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">{editing === 'new' ? 'New Fabric' : 'Edit Fabric'}</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'id', label: 'ID', type: 'text', placeholder: 'cotton' },
              { key: 'name', label: 'Name', type: 'text', placeholder: 'Premium Cotton' },
              { key: 'priceMultiplier', label: 'Price Multiplier', type: 'number', placeholder: '1.0' },
              { key: 'roughness', label: 'Roughness (0-1)', type: 'number', placeholder: '0.8' },
              { key: 'metalness', label: 'Metalness (0-1)', type: 'number', placeholder: '0' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-zinc-500 mb-1">{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })} placeholder={placeholder} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500" />
              </div>
            ))}
            <div className="col-span-2"><label className="block text-xs text-zinc-500 mb-1">Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="btn-primary flex-1 justify-center"><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className="btn-secondary flex-1 justify-center"><XCircle size={14} /> Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="flex justify-center py-8 text-zinc-500"><RefreshCw size={20} className="animate-spin" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fabrics.map((f) => (
            <div key={f._id} className={clsx('glass-dark rounded-2xl p-5 border', f.isActive ? 'border-white/5' : 'border-red-500/20 opacity-60')}>
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="font-semibold text-white">{f.name}</h3><span className="text-xs text-zinc-500 font-mono">{f.id}</span></div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(f)} className="btn-ghost p-1.5"><Edit2 size={13} /></button>
                  <button onClick={() => remove(f._id)} className="btn-ghost p-1.5 text-red-400"><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mb-3">{f.description}</p>
              <div className="flex gap-2 flex-wrap text-xs">
                <span className="bg-zinc-800/60 rounded-lg px-2 py-1">×{f.priceMultiplier} price</span>
                <span className="bg-zinc-800/60 rounded-lg px-2 py-1">R:{f.roughness}</span>
                <span className="bg-zinc-800/60 rounded-lg px-2 py-1">M:{f.metalness}</span>
                <span className={f.isActive ? 'text-green-400' : 'text-red-400'}>{f.isActive ? 'Active' : 'Hidden'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Customers Panel ──────────────────────────────────────────────────────────

function CustomersPanel({ token }: { token: string }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (roleFilter !== 'all') params.role = roleFilter
      if (search) params.search = search
      const { data } = await API.get('/admin/users', { headers: { Authorization: `Bearer ${token}` }, params })
      setCustomers(data.users)
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }, [token, roleFilter, search])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  async function changeRole(id: string, role: string) {
    try {
      await API.patch(`/admin/users/${id}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Role updated'); fetchCustomers()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed') }
  }

  async function remove(id: string) {
    if (!confirm('Delete this user? Irreversible.')) return
    try {
      await API.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Deleted'); fetchCustomers()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const ROLE_COLORS: Record<string, string> = { admin: 'text-brand-400 bg-brand-400/10', customer: 'text-blue-400 bg-blue-400/10', production: 'text-orange-400 bg-orange-400/10' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Customer Management</h2>
        <button onClick={fetchCustomers} className="btn-ghost"><RefreshCw size={15} /></button>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email…" className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="production">Production</option>
        </select>
      </div>
      {loading ? <div className="flex justify-center py-12 text-zinc-500"><RefreshCw size={20} className="animate-spin" /></div> : (
        <div className="overflow-x-auto glass-dark rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead><tr className="text-zinc-500 text-xs border-b border-white/5">
              <th className="text-left p-4">Name</th><th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th><th className="text-left p-4">Joined</th><th className="text-left p-4">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((u) => (
                <tr key={u._id} className="hover:bg-white/2">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center text-xs font-bold text-brand-300">{u.name[0].toUpperCase()}</div>
                      <span className="text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400">{u.email}</td>
                  <td className="p-4">
                    <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className={clsx('text-xs px-2 py-1 rounded-lg border-0 focus:outline-none cursor-pointer', ROLE_COLORS[u.role] ?? 'text-zinc-400 bg-zinc-800')}>
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                      <option value="production">production</option>
                    </select>
                  </td>
                  <td className="p-4 text-zinc-500 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4"><button onClick={() => remove(u._id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300"><Trash2 size={14} /></button></td>
                </tr>
              ))}
              {customers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No users found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Analytics Panel ──────────────────────────────────────────────────────────

function AnalyticsPanel({ token }: { token: string }) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [period, setPeriod] = useState('30')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await API.get(`/admin/analytics?period=${period}`, { headers: { Authorization: `Bearer ${token}` } })
        setAnalytics(data)
      } catch { toast.error('Failed to load analytics') }
      finally { setLoading(false) }
    }
    load()
  }, [token, period])

  if (loading) return <div className="flex justify-center py-20 text-zinc-500"><RefreshCw size={24} className="animate-spin" /></div>

  const byDay = analytics?.revenueByDay ?? []
  const maxRev = Math.max(...byDay.map((d: any) => d.revenue), 1)
  const totalRev = byDay.reduce((acc: number, d: any) => acc + d.revenue, 0)
  const totalOrders = byDay.reduce((acc: number, d: any) => acc + d.count, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard label={`Revenue (${period}d)`} value={`₹${totalRev.toLocaleString('en-IN')}`} icon={DollarSign} color="bg-green-500/15 text-green-400" />
        <StatCard label={`Orders (${period}d)`} value={totalOrders} icon={Package} color="bg-blue-500/15 text-blue-400" />
      </div>
      {byDay.length > 0 ? (
        <div className="glass-dark rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-6">Daily Revenue</h3>
          <div className="flex items-end gap-1.5 h-40">
            {byDay.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div className="w-full bg-brand-600/60 hover:bg-brand-400 rounded-t-sm transition-colors" style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: 4 }} />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  {d._id}<br />₹{d.revenue.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 mt-2"><span>{byDay[0]?._id}</span><span>{byDay[byDay.length - 1]?._id}</span></div>
        </div>
      ) : (
        <div className="glass-dark rounded-2xl p-10 text-center border border-white/5 text-zinc-500">No revenue data for this period</div>
      )}
      <div className="glass-dark rounded-2xl p-6 border border-white/5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-5">Orders by Status</h3>
        <div className="space-y-3">
          {(analytics?.ordersByStatus ?? []).map((s: any) => {
            const total = (analytics?.ordersByStatus ?? []).reduce((a: number, x: any) => a + x.count, 0)
            const pct = total ? Math.round((s.count / total) * 100) : 0
            return (
              <div key={s._id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={clsx('px-2 py-0.5 rounded-full', STATUS_COLORS[s._id] ?? 'text-zinc-400')}>{s._id}</span>
                  <span className="text-zinc-400">{s.count} ({pct}%)</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Coupons Panel ────────────────────────────────────────────────────────────

function CouponsPanel({ token }: { token: string }) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null | 'new'>(null)
  const [form, setForm] = useState<any>({ code: '', type: 'percentage', value: 10, minOrderAmount: 0, maxUses: '', isActive: true, expiresAt: '', description: '' })

  const fetchCoupons = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/admin/coupons', { headers: { Authorization: `Bearer ${token}` } })
      setCoupons(data.coupons)
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }, [token])

  useEffect(() => { fetchCoupons() }, [fetchCoupons])

  async function save() {
    try {
      const payload = { ...form, maxUses: form.maxUses ? parseInt(form.maxUses) : null, expiresAt: form.expiresAt || null }
      if (editing && editing !== 'new') {
        await API.put(`/admin/coupons/${editing}`, payload, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Updated')
      } else {
        await API.post('/admin/coupons', payload, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Created')
      }
      setEditing(null); fetchCoupons()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Save failed') }
  }

  function startEdit(c: Coupon) {
    setEditing(c._id); setForm({ code: c.code, type: c.type, value: c.value, minOrderAmount: c.minOrderAmount, maxUses: c.maxUses ?? '', isActive: c.isActive, expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '', description: c.description })
  }

  async function remove(id: string) {
    if (!confirm('Delete coupon?')) return
    try {
      await API.delete(`/admin/coupons/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Deleted'); fetchCoupons()
    } catch { toast.error('Delete failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Discount Coupons</h2>
        <button onClick={() => { setEditing('new'); setForm({ code: '', type: 'percentage', value: 10, minOrderAmount: 0, maxUses: '', isActive: true, expiresAt: '', description: '' }) }} className="btn-primary"><Plus size={15} /> Create Coupon</button>
      </div>
      {editing && (
        <div className="glass-dark rounded-2xl p-6 border border-brand-500/20 mb-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">{editing === 'new' ? 'New Coupon' : 'Edit Coupon'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><label className="block text-xs text-zinc-500 mb-1">Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE20" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-brand-500" /></div>
            <div><label className="block text-xs text-zinc-500 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div><label className="block text-xs text-zinc-500 mb-1">Value</label><input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500" /></div>
            <div><label className="block text-xs text-zinc-500 mb-1">Min Order (₹)</label><input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" /></div>
            <div><label className="block text-xs text-zinc-500 mb-1">Max Uses (blank=∞)</label><input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" /></div>
            <div><label className="block text-xs text-zinc-500 mb-1">Expires</label><input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" /></div>
            <div className="col-span-2"><label className="block text-xs text-zinc-500 mb-1">Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" /></div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}>
                {form.isActive ? <ToggleRight size={20} className="text-brand-400" /> : <ToggleLeft size={20} className="text-zinc-600" />}
              </button>
              <label className="text-xs text-zinc-400">Active</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} className="btn-primary flex-1 justify-center"><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className="btn-secondary flex-1 justify-center"><XCircle size={14} /> Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="flex justify-center py-8 text-zinc-500"><RefreshCw size={20} className="animate-spin" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((c) => (
            <div key={c._id} className={clsx('glass-dark rounded-2xl p-5 border', c.isActive ? 'border-white/5' : 'border-red-500/20 opacity-70')}>
              <div className="flex items-start justify-between mb-3">
                <div><div className="font-mono text-xl font-bold text-white tracking-wider">{c.code}</div><div className="text-xs text-zinc-500 mt-0.5">{c.description}</div></div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(c)} className="btn-ghost p-1.5"><Edit2 size={13} /></button>
                  <button onClick={() => remove(c._id)} className="btn-ghost p-1.5 text-red-400"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-brand-500/15 text-brand-300 rounded-lg px-2 py-1">{c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}</span>
                {c.minOrderAmount > 0 && <span className="bg-zinc-800/60 text-zinc-400 rounded-lg px-2 py-1">Min ₹{c.minOrderAmount}</span>}
                {c.maxUses && <span className="bg-zinc-800/60 text-zinc-400 rounded-lg px-2 py-1">{c.usedCount}/{c.maxUses} used</span>}
                {c.expiresAt && <span className="bg-zinc-800/60 text-zinc-400 rounded-lg px-2 py-1 flex items-center gap-1"><Calendar size={10} />{new Date(c.expiresAt).toLocaleDateString('en-IN')}</span>}
                <span className={clsx('rounded-lg px-2 py-1', c.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10')}>{c.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
          {coupons.length === 0 && <div className="col-span-2 text-center py-12 text-zinc-500">No coupons yet. Create one!</div>}
        </div>
      )}
    </div>
  )
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel({ user }: { user: any }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Admin Settings</h2>
      <div className="glass-dark rounded-2xl p-6 border border-white/5 mb-6">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2"><Shield size={15} /> Admin Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-2xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="text-xl font-bold text-white">{user?.name}</div>
            <div className="text-zinc-500">{user?.email}</div>
            <div className="text-xs text-brand-400 mt-1 uppercase tracking-wider">{user?.role}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-zinc-800/60 rounded-xl p-4"><div className="text-zinc-500 text-xs mb-1">Role</div><div className="text-brand-400 font-semibold">{user?.role}</div></div>
          <div className="bg-zinc-800/60 rounded-xl p-4"><div className="text-zinc-500 text-xs mb-1">Member Since</div><div className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}</div></div>
        </div>
      </div>
      <div className="glass-dark rounded-2xl p-6 border border-white/5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Platform Info</h3>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Platform', value: 'ATELIER Custom Clothing' },
            { label: 'API Base', value: 'http://localhost:5000/api' },
            { label: 'Database', value: 'MongoDB (atelier-clothing)' },
            { label: 'Backend', value: 'Express + Mongoose' },
            { label: 'Frontend', value: 'React + Vite + Three.js' },
            { label: 'Auth', value: 'JWT (30 days)' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-zinc-500">{label}</span>
              <span className="text-white font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS: { section: AdminSection; label: string; icon: any }[] = [
  { section: 'overview', label: 'Overview', icon: LayoutDashboard },
  { section: 'orders', label: 'Orders', icon: Package },
  { section: 'products', label: 'Products', icon: Shirt },
  { section: 'colors', label: 'Colors', icon: Palette },
  { section: 'fabrics', label: 'Fabrics', icon: Layers },
  { section: 'customers', label: 'Customers', icon: Users },
  { section: 'analytics', label: 'Analytics', icon: BarChart2 },
  { section: 'coupons', label: 'Coupons', icon: Tag },
  { section: 'settings', label: 'Settings', icon: Settings },
]

// ─── Main Admin Page ──────────────────────────────────────────────────────────

interface AdminPageProps { loginOnly?: boolean }

export default function AdminPage({ loginOnly = false }: AdminPageProps) {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [section, setSection] = useState<AdminSection>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loginOnly || !user || !token) return <AdminLoginPage />

  function handleLogout() {
    logout()
    navigate('/admin-login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={clsx('fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-white/5 z-40 flex flex-col transition-transform duration-300', sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow"><Sparkles size={18} className="text-white" /></div>
            <div>
              <div className="font-display font-bold text-white text-base">ATELIER</div>
              <div className="text-[10px] text-brand-400 uppercase tracking-widest">Admin Panel</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-600/40 flex items-center justify-center text-xs font-bold text-brand-300">{user.name[0].toUpperCase()}</div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-[10px] text-zinc-500 truncate">{user.email}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ section: s, label, icon: Icon }) => (
            <button key={s} onClick={() => { setSection(s); setSidebarOpen(false) }} className={clsx('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150', section === s ? 'bg-brand-600/20 text-white border border-brand-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5')}>
              <Icon size={16} className={section === s ? 'text-brand-400' : ''} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur border-b border-white/5 flex items-center justify-between px-5 py-3.5">
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost lg:hidden"><Menu size={20} /></button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-zinc-400">
            <LayoutDashboard size={14} /><ChevronRight size={12} /><span className="text-white capitalize">{section}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-zinc-600 hidden md:block">Admin: {user.name}</div>
            <button onClick={handleLogout} className="btn-ghost text-xs flex items-center gap-1.5 px-3 py-2">
              <LogOut size={14} /><span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
              {section === 'overview' && <OverviewPanel token={token} />}
              {section === 'orders' && <OrdersPanel token={token} />}
              {section === 'products' && <ProductsPanel token={token} />}
              {section === 'colors' && <ColorsPanel token={token} />}
              {section === 'fabrics' && <FabricsPanel token={token} />}
              {section === 'customers' && <CustomersPanel token={token} />}
              {section === 'analytics' && <AnalyticsPanel token={token} />}
              {section === 'coupons' && <CouponsPanel token={token} />}
              {section === 'settings' && <SettingsPanel user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
