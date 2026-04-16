import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AuthCallbackPage from "./pages/auth/AuthCallbackPage";
import UserNotificationsPage from "./pages/notifications/UserNotificationsPage";
import UserLayout from "./components/user/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import NotificationPage from "./pages/admin/NotificationPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagementPage from "./pages/admin/UserManagementPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Protected — USER routes (all share UserLayout) */}
          <Route
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route
              path="/user/notifications"
              element={<UserNotificationsPage />}
            />
          </Route>

          {/* Protected — ADMIN only (all share AdminLayout) */}
          <Route
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/notifications" element={<NotificationPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
