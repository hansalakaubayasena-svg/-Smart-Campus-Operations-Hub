// src/components/admin/AdminSideBar.jsx
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ShieldCheck,
  Users,
  Megaphone,
  Building,
  ClipboardCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    Icon: LayoutDashboard,
    hoverColor: "",
  },
  {
    to: "/admin/facilities",
    label: "Manage Facilities",
    Icon: Building,
    hoverColor: "group-hover:text-teal-400",
  },
  {
    to: "/admin/bookings",
    label: "Bookings Management",
    Icon: ClipboardCheck,
    hoverColor: "group-hover:text-orange-400",
  },
  {
    to: "/admin/users",
    label: "User Management",
    Icon: Users,
    hoverColor: "group-hover:text-purple-400",
  },
  {
    to: "/admin/notifications",
    label: "Manage Notifications",
    Icon: Megaphone,
    hoverColor: "group-hover:text-amber-400",
  },
];

const AdminSidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-[#162238] to-slate-900 text-slate-300 flex flex-col shadow-2xl z-20 hidden md:flex animate-slide-right relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <ShieldCheck className="h-6 w-6 text-accent-emerald mr-2" />
        <span className="text-lg font-bold text-white tracking-tight">
          Hub Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(({ to, label, Icon, hoverColor }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-slate-800 text-white rounded-xl font-medium shadow-sm group"
                : "group flex items-center px-4 py-3 hover:bg-slate-800 hover:text-white text-slate-400 rounded-xl font-medium transition-all duration-300 hover:translate-x-1"
            }
          >
            <Icon
              className={`h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300 ${hoverColor}`}
            />
            {label}
          </NavLink>
        ))}

        {/* Settings */}
        <div className="pt-4 mt-4 border-t border-slate-800/60 space-y-1">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-slate-800 text-white rounded-xl font-medium shadow-sm group"
                : "group flex items-center px-4 py-3 hover:bg-slate-800/80 hover:text-white text-slate-400 rounded-xl font-medium transition-all duration-300 hover:translate-x-1"
            }
          >
            <Settings className="h-5 w-5 mr-3 group-hover:scale-110 group-hover:rotate-45 transition-all duration-300" />
            System Settings
          </NavLink>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <button
          onClick={logout}
          className="group flex items-center w-full px-4 py-3 text-slate-400 hover:bg-red-900/30 hover:text-red-400 rounded-xl font-medium transition-all duration-300 hover:translate-x-1"
        >
          <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
