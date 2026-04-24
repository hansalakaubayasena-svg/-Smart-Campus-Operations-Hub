import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-extrabold text-blue-600">SCO</div>
          <span className="hidden text-lg font-semibold text-slate-900 sm:inline">
            Smart Campus
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="font-medium text-slate-600 hover:text-blue-600">
            Features
          </a>
          <a href="/#how-it-works" className="font-medium text-slate-600 hover:text-blue-600">
            How It Works
          </a>
          <a href="/#benefits" className="font-medium text-slate-600 hover:text-blue-600">
            Benefits
          </a>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="hidden items-center gap-4 md:flex">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-slate-600 hover:text-blue-600"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-slate-600">
                {user?.fullName || "User"}
              </span>
              <Link
                to="/user/dashboard"
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-900 hover:bg-slate-200"
              >
                Dashboard
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin/dashboard"
                  className="rounded-lg bg-amber-100 px-4 py-2 font-semibold text-amber-900 hover:bg-amber-200"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="font-semibold text-slate-600 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 px-6 py-4 md:hidden">
          <div className="space-y-4">
            <a href="/#features" className="block font-medium text-slate-600 hover:text-blue-600">
              Features
            </a>
            <a href="/#how-it-works" className="block font-medium text-slate-600 hover:text-blue-600">
              How It Works
            </a>
            <a href="/#benefits" className="block font-medium text-slate-600 hover:text-blue-600">
              Benefits
            </a>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full rounded-lg border border-blue-600 py-2 font-semibold text-blue-600"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/user/dashboard"
                  className="block rounded-lg bg-slate-100 py-2 text-center font-semibold text-slate-900"
                >
                  Dashboard
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin/dashboard"
                    className="block rounded-lg bg-amber-100 py-2 text-center font-semibold text-amber-900"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-red-600 py-2 font-semibold text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
