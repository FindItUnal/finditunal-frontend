import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
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
} from './pages';
import Layout from './components/templates/Layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Routes that share the Header/Layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/object/:id" element={<ObjectDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
