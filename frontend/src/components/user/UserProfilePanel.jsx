// src/components/user/UserProfilePanel.jsx
import { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Shield,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, deleteMyAccount } from "../../services/auth/userApi";

// ── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
];
const getAvatarColor = (name = "") =>
  name
    ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
    : "bg-blue-500";

const ROLE_CONFIG = {
  ADMIN: {
    label: "Admin",
    className: "bg-purple-100 text-purple-700 border border-purple-200",
  },
  USER: {
    label: "User",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  TECHNICIAN: {
    label: "Technician",
    className: "bg-orange-100 text-orange-700 border border-orange-200",
  },
};

// ── Reusable input ────────────────────────────────────────────────────────────

const Field = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  right,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium text-slate-900 bg-slate-50 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white
          transition-all duration-200 ${error ? "border-red-300 bg-red-50" : "border-slate-200"} ${right ? "pr-11" : ""}`}
      />
      {right && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
  </div>
);

const EyeToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="text-slate-400 hover:text-slate-600 transition-colors"
  >
    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
);

// ── Main component ────────────────────────────────────────────────────────────

const UserProfilePanel = ({ isOpen, onClose }) => {
  const { user, updateUser, logout } = useAuth();

  // "profile" | "edit" | "delete"
  const [view, setView] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Edit form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Delete state
  const [deletePw, setDeletePw] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Reset everything when panel opens
  useEffect(() => {
    if (isOpen && user) {
      setView("profile");
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setDeletePw("");
      setDeleteError("");
      setShowPw({ current: false, new: false, confirm: false });
    }
  }, [isOpen, user]);

  const toast$ = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Edit submit ────────────────────────────────────────────────────────
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Must be a valid email";
    if (form.newPassword && form.newPassword.length < 8)
      errs.newPassword = "At least 8 characters required";
    if (form.newPassword && form.newPassword !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (form.newPassword && !form.currentPassword)
      errs.currentPassword = "Required to change password";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const updated = await updateProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      updateUser(updated); // re-issues JWT + updates context
      toast$("success", "Profile updated successfully!");
      setView("profile");
    } catch (err) {
      toast$(
        "error",
        err.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Delete submit ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteError("");
    setLoading(true);
    try {
      await deleteMyAccount(deletePw || undefined);
      logout(); // clears storage + hard redirects to /login
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account");
      setLoading(false);
    }
  };

  const roleConfig = ROLE_CONFIG[user?.role] ?? ROLE_CONFIG.USER;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Slide panel ──────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-50 bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Toast notification */}
        {toast && (
          <div
            className={`absolute top-4 left-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-semibold shadow-lg animate-slide-up ${
                toast.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            {toast.message}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            VIEW: PROFILE
        ════════════════════════════════════════════════════════════════ */}
        {view === "profile" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <h2 className="text-[15px] font-bold text-slate-900">
                My Profile
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setView("edit")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                    text-slate-600 hover:bg-slate-100 transition-colors duration-200"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400
                    hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Avatar + name */}
            <div className="flex flex-col items-center pt-8 pb-6 px-6">
              <div
                className={`h-20 w-20 rounded-2xl flex items-center justify-center text-white
                  text-2xl font-extrabold shadow-lg ${getAvatarColor(user?.fullName)}`}
              >
                {getInitials(user?.fullName)}
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 text-center">
                {user?.fullName}
              </h3>
              <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
              <span
                className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${roleConfig.className}`}
              >
                {roleConfig.label}
              </span>
            </div>

            {/* Info card */}
            <div className="mx-6 rounded-2xl border border-slate-100 bg-slate-50 divide-y divide-slate-100">
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                iconBg="bg-blue-50 text-blue-500"
                label="Email"
                value={user?.email}
              />
              <InfoRow
                icon={<Shield className="h-4 w-4" />}
                iconBg="bg-purple-50 text-purple-500"
                label="Role"
                value={roleConfig.label}
              />
              <InfoRow
                icon={<User className="h-4 w-4" />}
                iconBg="bg-slate-100 text-slate-500"
                label="User ID"
                value={`#${user?.userId}`}
              />
            </div>

            {/* Danger zone */}
            <div className="mt-auto px-6 pb-8 pt-6">
              <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4">
                <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-1">
                  Danger Zone
                </p>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Permanently deletes your account and all associated data. This
                  cannot be undone.
                </p>
                <button
                  onClick={() => setView("delete")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-white
                    text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white hover:border-red-600
                    transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════
            VIEW: EDIT PROFILE
        ════════════════════════════════════════════════════════════════ */}
        {view === "edit" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("profile")}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400
                    hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-[15px] font-bold text-slate-900">
                  Edit Profile
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400
                  hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable form */}
            <form
              onSubmit={handleEditSubmit}
              className="flex-1 overflow-y-auto px-6 pt-6 pb-6 space-y-5"
            >
              {/* Basic info section */}
              <div className="space-y-4">
                <SectionLabel>Basic Information</SectionLabel>
                <Field
                  label="Full Name"
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    setErrors({ ...errors, fullName: "" });
                  }}
                  error={errors.fullName}
                  placeholder="Your full name"
                />
                <Field
                  label="Email Address"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  error={errors.email}
                  placeholder="your@email.com"
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Lock className="h-3 w-3" />
                  Change Password
                  <span className="font-normal opacity-75">(optional)</span>
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Password fields */}
              <div className="space-y-4">
                <Field
                  label="Current Password"
                  id="currentPassword"
                  type={showPw.current ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => {
                    setForm({ ...form, currentPassword: e.target.value });
                    setErrors({ ...errors, currentPassword: "" });
                  }}
                  error={errors.currentPassword}
                  placeholder="Enter current password"
                  right={
                    <EyeToggle
                      show={showPw.current}
                      onToggle={() =>
                        setShowPw({ ...showPw, current: !showPw.current })
                      }
                    />
                  }
                />
                <Field
                  label="New Password"
                  id="newPassword"
                  type={showPw.new ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => {
                    setForm({ ...form, newPassword: e.target.value });
                    setErrors({ ...errors, newPassword: "" });
                  }}
                  error={errors.newPassword}
                  placeholder="Min. 8 characters"
                  right={
                    <EyeToggle
                      show={showPw.new}
                      onToggle={() =>
                        setShowPw({ ...showPw, new: !showPw.new })
                      }
                    />
                  }
                />
                <Field
                  label="Confirm New Password"
                  id="confirmPassword"
                  type={showPw.confirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm({ ...form, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  error={errors.confirmPassword}
                  placeholder="Repeat new password"
                  right={
                    <EyeToggle
                      show={showPw.confirm}
                      onToggle={() =>
                        setShowPw({ ...showPw, confirm: !showPw.confirm })
                      }
                    />
                  }
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl
                  bg-slate-900 text-white text-sm font-bold shadow-sm
                  hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════
            VIEW: DELETE ACCOUNT
        ════════════════════════════════════════════════════════════════ */}
        {view === "delete" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("profile")}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400
                    hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-[15px] font-bold text-slate-900">
                  Delete Account
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400
                  hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 px-6 pt-8 flex flex-col">
              {/* Warning illustration */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  Are you sure?
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  This is{" "}
                  <span className="font-bold text-slate-700">
                    permanent and irreversible
                  </span>
                  . All your data, bookings, and activity history will be
                  deleted immediately.
                </p>
              </div>

              {/* Account preview card */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center
                    text-white text-sm font-extrabold shrink-0 ${getAvatarColor(user?.fullName)}`}
                >
                  {getInitials(user?.fullName)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Password confirmation */}
              <div className="mb-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showDeletePw ? "text" : "password"}
                    value={deletePw}
                    onChange={(e) => {
                      setDeletePw(e.target.value);
                      setDeleteError("");
                    }}
                    placeholder="Enter your password to confirm"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm font-medium text-slate-900
                      bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2
                      focus:ring-red-500/20 focus:border-red-400 focus:bg-white transition-all duration-200 ${
                        deleteError
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePw(!showDeletePw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                      hover:text-slate-600 transition-colors"
                  >
                    {showDeletePw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {deleteError && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {deleteError}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Signed in with Google? You may leave this empty.
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-auto pb-8 pt-4 space-y-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                    bg-red-600 text-white text-sm font-bold hover:bg-red-700
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete My Account
                    </>
                  )}
                </button>
                <button
                  onClick={() => setView("profile")}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600
                    text-sm font-semibold hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// ── Small layout helpers ──────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
    {children}
  </p>
);

const InfoRow = ({ icon, iconBg, label, value }) => (
  <div className="flex items-center gap-3 px-4 py-3.5">
    <div
      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
    </div>
  </div>
);

export default UserProfilePanel;
