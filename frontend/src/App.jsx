import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ResourceProvider } from './components/facilities/context/ResourceContext';
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
import IncidentsPage from "./pages/incidents/IncidentsPage";

import { FacilityDirectory } from './components/facilities/pages/FacilityDirectory';
import { AdminManagement } from './components/facilities/pages/AdminManagement';
import { FacilityDetailsPage } from './components/facilities/pages/FacilityDetailsPage';
import UserBookingsPage from './pages/user/UserBookingsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import BookingCheckInPage from './pages/check-in/BookingCheckInPage';

export function App() {
  return (
    <AuthProvider>
      <ResourceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/check-in/:token" element={<BookingCheckInPage />} />

            {/* Protected — USER routes (all share UserLayout) */}
            <Route
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/notifications" element={<UserNotificationsPage />} />
              <Route path="/user/facilities" element={<FacilityDirectory />} />
              <Route path="/user/facilities/:resourceId" element={<FacilityDetailsPage />} />
              <Route path="/user/bookings" element={<UserBookingsPage />} />
              <Route path="/user/ticketing" element={<IncidentsPage />} />
            </Route>

            {/* Protected — ADMIN only (all share AdminLayout) */}
            <Route
              element={
                <ProtectedRoute requiredRole="ADMINISTRATOR">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/notifications" element={<NotificationPage />} />
              <Route path="/admin/facilities" element={<AdminManagement />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/ticketing" element={<IncidentsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ResourceProvider>
    </AuthProvider>
  );
}

export default App;
