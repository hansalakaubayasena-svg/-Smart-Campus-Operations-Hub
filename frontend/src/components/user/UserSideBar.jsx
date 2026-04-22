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

const navItems = [
  { to: "/user/dashboard", icon: Home, label: "Home" },
  { to: "/user/facilities", icon: Building, label: "Facilities" },
  { to: "/user/bookings", icon: Bookmark, label: "My Bookings" },
  { to: "/user/ticketing", icon: Wrench, label: "Ticketing" },
  { to: "/user/notifications", icon: Bell, label: "Notifications" },
];

const UserSidebar = () => {
  const { logout, user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

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
    <aside className="w-64 bg-gradient-to-b from-white via-slate-50/80 to-slate-100/50 border-r border-slate-200/60 hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-900/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200/60 bg-white/40 backdrop-blur-sm">
        <ShieldCheck className="h-6 w-6 text-primary-900 mr-2" />
        <span className="text-lg font-bold text-primary-900 tracking-tight">
          Campus Hub
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? "bg-primary-50 text-primary-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
              }`
            }
          >
            <Icon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300 text-slate-400 group-hover:text-primary-900" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profile Settings */}
      <div className="p-4 border-t border-slate-200/60 bg-slate-50/30 space-y-3">
        <button
          onClick={() => setShowProfileModal(true)}
          className="group w-full px-4 py-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 transition-all duration-300 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-cyan-200 flex items-center justify-center font-bold text-cyan-700 text-sm">
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
          className="group flex items-center w-full px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition-all duration-300 hover:translate-x-1"
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
