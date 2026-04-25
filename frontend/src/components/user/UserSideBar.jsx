import { useState } from "react";
import {
  Home,
  Bell,
  LogOut,
  ShieldCheck,
  Building,
  Bookmark,
  Settings,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileSettingsModal from "./ProfileSettingsModal";

const UserSidebar = () => {
  const { logout, user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navItems = [
    { to: "/user/dashboard", icon: Home, label: "Home" },
    { to: "/user/facilities", icon: Building, label: "Facilities" },
    { to: "/user/bookings", icon: Bookmark, label: "My Bookings" },
    {
      to: "/user/ticketing",
      icon: Wrench,
      label: user?.role === "TECHNICIAN" ? "Support Queue" : "Ticketing",
    },
    { to: "/user/notifications", icon: Bell, label: "Notifications" },
  ];

  // Generate initials from full name
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const initials = getInitials(user?.fullName);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm z-20 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white/40 backdrop-blur-sm">
        <ShieldCheck className="h-6 w-6 text-indigo-600 mr-2" />
        <span className="text-lg font-bold text-slate-900 tracking-tight">
          Campus Hub
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
              }`
            }
          >
            <Icon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300 text-slate-400 group-hover:text-indigo-600" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profile Settings */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3">
        <button
          onClick={() => setShowProfileModal(true)}
          className="group w-full px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 flex items-center justify-between border border-indigo-100/50"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm shadow-sm">
              {initials}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-900">
                {user?.fullName || "User"}
              </div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-cyan-600 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="group flex items-center w-full px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-2xl font-medium transition-all duration-300 hover:translate-x-1"
        >
          <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300 text-slate-400 group-hover:text-red-600" />
          Logout
        </button>
      </div>

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileSettingsModal
          onClose={() => setShowProfileModal(false)}
          user={user}
        />
      )}
    </aside>
  );
};

export default UserSidebar;
