import { useAuth } from "../context/AuthContext";

/**
 * Wrapper around useAuth() for Auth State Management
 * Usage: const { user, isAuthenticated, logout } = useAuthStore();
 */
export function useAuthStore() {
  const { user, loading, login, logout, isAdmin } = useAuth();
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin,
  };
}
