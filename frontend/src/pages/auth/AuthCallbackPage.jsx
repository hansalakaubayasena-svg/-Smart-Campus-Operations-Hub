import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchCurrentUser } from "../../services/auth/authApi";

/**
 * This page handles the redirect from our backend after Google OAuth.
 * URL looks like: http://localhost:5173/auth/callback?token=eyJhbGc...
 *
 * Steps:
 *  1. Extract token from URL query params
 *  2. Save to localStorage immediately
 *  3. Fetch full user data from /api/auth/me (token now in axiosClient)
 *  4. Store in AuthContext via login()
 *  5. Redirect to correct dashboard based on role
 *  6. Clean the token from the URL (security — no token in browser history)
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Read token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 2. Store token so axiosClient interceptor picks it up
        localStorage.setItem("token", token);

        // 3. Fetch full user data now that token is in localStorage
        const userData = await fetchCurrentUser();

        // 4. Store in context — { token, userId, email, fullName, role }
        login({ ...userData, token });

        // 5. Route based on role
        navigate(
          userData.role === "ADMINISTRATOR" || userData.role === "ADMIN"
            ? "/admin/dashboard"
            : "/user/dashboard",
          { replace: true },
        );
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900" />
      <p className="text-slate-600 font-medium">Completing sign in...</p>
    </div>
  );
};

export default AuthCallbackPage;
