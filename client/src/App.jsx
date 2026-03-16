import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import DiningPage from './pages/DiningPage';
import LoyaltyPage from './pages/LoyaltyPage';
import ExperiencePage from './pages/ExperiencePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Public site with shared layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="rooms/:id" element={<RoomDetailPage />} />
        <Route path="dining" element={<DiningPage />} />
        <Route path="experience" element={<ExperiencePage />} />

        {/* Auth required */}
        <Route path="loyalty" element={<ProtectedRoute><LoyaltyPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Login — no nav layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin — full-screen, no nav layout, admin role required */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    </Routes>
  );
}
