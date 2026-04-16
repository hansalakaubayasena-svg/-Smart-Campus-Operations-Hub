import { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser } from "../services/auth/authApi";

/**
 * AuthContext — global auth state accessible from any component.
 * Stores: user object, token, loading state.
 * Provides: login(), logout() helpers.
 *
 * WHY Context?
 *  Without it, every component that needs to know "who is logged in"
 *  would have to read localStorage directly — messy and not reactive.
 *  Context makes auth state reactive — any component re-renders when it changes.
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // loading=true on first mount — prevents flash of login page on refresh

  useEffect(() => {
    // On every app load — check if a valid token exists in localStorage
    // If yes, verify it with backend and restore user state
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
      } catch {
        // Token expired or invalid — clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  /**
   * Called after successful login or register.
   * Saves token to localStorage (persists across browser refresh)
   * and sets user in context (reactive — components update immediately).
   */
  const login = (authData) => {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData));
    setUser(authData);
  };

  /**
   * Called on logout button.
   * Clears everything — context state + localStorage.
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (authData) => {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData));
    setUser(authData);
  };

  // isAdmin convenience flag — used by ProtectedRoute and nav components
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — cleaner than useContext(AuthContext) everywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};