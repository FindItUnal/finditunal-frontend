import { Routes, Route, Navigate } from 'react-router-dom';
import {
  LoginPage,
  DashboardPage,
  ProfilePage,
  MessagesPage,
  LandingPage,
  ObjectDetailPage,
  AdminDashboardPage,
  AdminUsersPage,
  AdminReportsPage,
  AuthCallbackPage,
} from '../pages';
import Layout from '../components/templates/Layout';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Rutas protegidas con Layout compartido */}
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/object/:id"
          element={
            <PrivateRoute>
              <ObjectDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <MessagesPage />
            </PrivateRoute>
          }
        />
        
        {/* Rutas de admin requieren role='admin' */}
        <Route
          path="/admin"
          element={
              <AdminDashboardPage />
          }
        />
        <Route
          path="/admin/users"
          element={
              <AdminUsersPage />
            
          }
        />
        <Route
          path="/admin/reports"
          element={
              <AdminReportsPage />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
