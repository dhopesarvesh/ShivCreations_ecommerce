import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import AuthPage from '../features/auth/pages/AuthPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import CartPage from '../features/cart/pages/CartPage';
import HomePage from '../features/products/pages/HomePage';
import CategoryProductsPage from '../features/products/pages/CategoryProductsPage';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import AdminProductsPage from '../features/admin/pages/AdminProductsPage';
import AdminCategoriesPage from '../features/admin/pages/AdminCategoriesPage';
import AdminUsersPage from '../features/admin/pages/AdminUsersPage';
import AdminOrdersPage from '../features/admin/pages/AdminOrdersPage';
import OrdersPage from '../features/orders/pages/OrdersPage';
import ProtectedRoute from './ProtectedRoute';
import UserRoute from './UserRoute';
import AdminRoute from './AdminRoute';
import PublicRoute from './PublicRoute';
import AboutPage from '../features/about/pages/AboutPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path="/flowers" element={<PublicRoute><CategoryProductsPage category="Flowers" description="Soft floral-inspired rangoli patterns that brighten festive spaces." /></PublicRoute>} />
            <Route path="/letters" element={<PublicRoute><CategoryProductsPage category="Letters" description="Elegant letter and name stencils for custom doorstep celebrations." /></PublicRoute>} />
            <Route path="/swastika" element={<PublicRoute><CategoryProductsPage category="Swastika" description="Traditional and auspicious symbolic designs with a modern finish." /></PublicRoute>} />
            <Route path="/about" element={<PublicRoute><AboutPage /></PublicRoute>} />
            <Route path="/account" element={<AuthPage />} />
            <Route path="/profile" element={<UserRoute><ProfilePage /></UserRoute>} />
            <Route path="/admin/profile" element={<AdminRoute><ProfilePage /></AdminRoute>} />
            <Route path="/orders" element={<UserRoute><OrdersPage /></UserRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
