import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { registerUser, initiateGoogleLogin, initiateGitHubLogin } from "../../services/auth/authApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// ── Helpers ───────────────────────────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "One number (0–9)", test: (p) => /[0-9]/.test(p) },
  {
    label: "One special character (!@#…)",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

const STRENGTH_CONFIG = [
  { label: "", color: "bg-slate-200" },
  { label: "Weak", color: "bg-red-500" },
  { label: "Fair", color: "bg-orange-400" },
  { label: "Good", color: "bg-yellow-400" },
  { label: "Strong", color: "bg-emerald-500" },
  { label: "Very strong", color: "bg-emerald-600" },
];

// ── Password Strength Meter ───────────────────────────────────────────────────
const PasswordStrengthMeter = ({ password }) => {
  const score = useMemo(
    () => PASSWORD_RULES.filter((r) => r.test(password)).length,
    [password],
  );

  const config = STRENGTH_CONFIG[score];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= score ? config.color : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        {score > 0 && (
          <span
            className={`text-xs font-bold text-right transition-colors duration-300 ${
              score <= 1
                ? "text-red-500"
                : score === 2
                  ? "text-orange-500"
                  : score === 3
                    ? "text-yellow-500"
                    : "text-emerald-600"
            }`}
          >
            {config.label}
          </span>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-1">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <li
              key={rule.label}
              className={`flex items-center gap-1 text-[11px] font-medium transition-colors duration-200 ${
                passed ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {passed ? (
                <CheckCircle2 className="h-3 w-3 shrink-0" />
              ) : (
                <XCircle className="h-3 w-3 shrink-0" />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });
  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordScore = useMemo(
    () => PASSWORD_RULES.filter((r) => r.test(form.password)).length,
    [form.password],
  );
  const isPasswordStrong = passwordScore === 5;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setError("");
    if (id === "password") setPasswordTouched(true);
    if (fieldErrors[id]) {
      setFieldErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (id === "email" && value && !isValidEmail(value)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    }
    if (id === "confirmPassword" && value && value !== form.password) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    }
  };

  const validate = () => {
    const errs = { fullName: "", email: "", password: "", confirmPassword: "" };
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!isValidEmail(form.email))
      errs.email = "Please enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    else if (!isPasswordStrong)
      errs.password = "Password must meet all requirements";
    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setFieldErrors(errs);
    return Object.values(errs).every((v) => !v);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const authData = await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      login(authData);
      navigate("/user/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <main className="bg-white overflow-hidden">
      <Header />

      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{
        backgroundImage: "radial-gradient(#d1d5db 1.5px, transparent 1.5px)",
        backgroundSize: "22px 22px",
      }}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                Create <span className="text-blue-600">Account</span>
              </h1>
              <p className="text-slate-600 text-base">
                Join Smart Campus Hub today
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 ${fieldErrors.fullName ? "text-red-400" : "text-slate-400"}`} />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 bg-slate-50 focus:bg-white hover:border-slate-300 transition-all duration-300 sm:text-sm outline-none ${
                      fieldErrors.fullName
                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                    placeholder="Your full name"
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                  University Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${fieldErrors.email ? "text-red-400" : "text-slate-400"}`} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 bg-slate-50 focus:bg-white hover:border-slate-300 transition-all duration-300 sm:text-sm outline-none ${
                      fieldErrors.email
                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                    placeholder="you@university.edu"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Account Type (Role) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="role">
                  Account Type
                </label>
                <select
                  id="role"
                  value={form.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 bg-slate-50 focus:bg-white hover:border-slate-300 transition-all duration-300 sm:text-sm outline-none focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="STUDENT">Student</option>
                  <option value="LECTURER">Lecturer</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${fieldErrors.password ? "text-red-400" : "text-slate-400"}`} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 bg-slate-50 focus:bg-white hover:border-slate-300 transition-all duration-300 sm:text-sm outline-none ${
                      fieldErrors.password
                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordTouched && <PasswordStrengthMeter password={form.password} />}
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${fieldErrors.confirmPassword ? "text-red-400" : "text-slate-400"}`} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 bg-slate-50 focus:bg-white hover:border-slate-300 transition-all duration-300 sm:text-sm outline-none ${
                      fieldErrors.confirmPassword
                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 0 20" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-500 font-medium">Or sign up with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={initiateGoogleLogin}
              className="w-full mt-4 inline-flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>

            {/* GitHub Sign Up Button */}
            <button
              type="button"
              onClick={initiateGitHubLogin}
              className="w-full mt-3 inline-flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign up with GitHub
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SignupPage;