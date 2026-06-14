import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { getSubdomainFromHost } from '../utils/tenant'
import ProtectedRoute from './ProtectedRoute'

import LandingSearch from '../pages/public/LandingSearch'
import MenuPage from '../pages/public/MenuPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import GoogleCallback from '../pages/auth/GoogleCallback'
import AdminLayout from '../pages/admin/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import SuperAdminDashboard from '../pages/admin/SuperAdminDashboard'
import Categories from '../pages/admin/Categories'
import MenuItems from '../pages/admin/MenuItems'
import Preview from '../pages/admin/Preview'
import Profile from '../pages/admin/Profile'
import Help from '../pages/admin/Help'
import Contact from '../pages/admin/Contact'

const adminRoutes = (
  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="analytics" element={<SuperAdminDashboard />} />
    <Route path="categories" element={<Categories />} />
    <Route path="menu-items" element={<MenuItems />} />
    <Route path="preview" element={<Preview />} />
    <Route path="profile" element={<Profile />} />
    <Route path="help" element={<Help />} />
    <Route path="contact" element={<Contact />} />
  </Route>
)

const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/auth/callback" element={<GoogleCallback />} />
  </>
)

export default function AppRouter() {
  const tenantSubdomain = getSubdomainFromHost()

  if (tenantSubdomain) {
    return (
      <Routes>
        <Route path="/" element={<MenuPage subdomain={tenantSubdomain} />} />
        {authRoutes}
        {adminRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingSearch />} />
      <Route path="/menu/:subdomain" element={<MenuPageRoute />} />
      {authRoutes}
      {adminRoutes}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function MenuPageRoute() {
  const { subdomain } = useParams()
  return <MenuPage subdomain={subdomain} />
}
