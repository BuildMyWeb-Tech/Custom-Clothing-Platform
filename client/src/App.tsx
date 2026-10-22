import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/storefront/Navbar'
import { CartDrawer } from '@/components/storefront/CartDrawer'
import { useAuthStore } from '@/store/authStore'
import HomePage from '@/pages/HomePage'
import DesignerPage from '@/pages/DesignerPage'
import LoginPage from '@/pages/LoginPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrdersPage from '@/pages/OrdersPage'
import AdminPage from '@/pages/AdminPage'
import ShopPage from '@/pages/ShopPage'

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to={adminOnly ? '/admin-login' : '/login'} replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    fetchMe()
  }, [])

  return (
    <>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/designer" element={<DesignerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route
          path="/checkout"
          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
        />
        <Route path="/admin-login" element={<AdminPage loginOnly />} />
        <Route
          path="/admin"
          element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
