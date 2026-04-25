import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Wraps any route that requires authentication.
 * requiredRole — optional, pass "ADMIN" to restrict to admins only.
 *
 * Flow:
 *  loading=true  → show spinner (AuthContext is still verifying token)
 *  no user       → redirect to /login
 *  wrong role    → redirect to their correct dashboard
 *  all good      → render the children
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // User is logged in but wrong role — send them to their correct dashboard
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
