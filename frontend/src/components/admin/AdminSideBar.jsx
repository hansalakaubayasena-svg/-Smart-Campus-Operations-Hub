import {
  LayoutDashboard,
  Settings,
  LogOut,
  ShieldCheck,
  Users,
  Megaphone,
  Building,
  ClipboardCheck,
  Wrench,
  BarChart3,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    Icon: LayoutDashboard,
    hoverColor: "group-hover:text-indigo-600",
  },
  {
    to: "/admin/analytics",
    label: "Analytics Insights",
    Icon: BarChart3,
    hoverColor: "group-hover:text-indigo-600",
  },
  {
    to: "/admin/facilities",
    label: "Manage Facilities",
    Icon: Building,
    hoverColor: "group-hover:text-indigo-600",
  },
  {
    to: "/admin/bookings",
    label: "Bookings Management",
    Icon: ClipboardCheck,
    hoverColor: "group-hover:text-indigo-600",
  },
  {
    to: "/admin/users",
    label: "User Management",
    Icon: Users,
    hoverColor: "group-hover:text-indigo-600",
  },
  {
    to: "/admin/notifications",
    label: "Manage Notifications",
    Icon: Megaphone,
    hoverColor: "group-hover:text-indigo-600",
  },
  {
    to: "/admin/ticketing",
    label: "Incidents & Ticketing",
    Icon: Wrench,
    hoverColor: "group-hover:text-indigo-600",
  },
];

const AdminSidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-600 flex flex-col shadow-sm z-20 hidden md:flex animate-slide-right relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />

      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <ShieldCheck className="h-6 w-6 text-indigo-600 mr-2" />
        <span className="text-lg font-bold text-slate-900 tracking-tight">
          Hub Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(({ to, label, Icon, hoverColor }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-semibold shadow-sm group border border-indigo-100/50"
                : "group flex items-center px-4 py-3 hover:bg-slate-50 hover:text-slate-900 text-slate-500 rounded-2xl font-medium transition-all duration-300 hover:translate-x-1"
            }
          >
            <Icon
              className={`h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300 ${hoverColor}`}
            />
            {label}
          </NavLink>
        ))}

        {/* Settings */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-semibold shadow-sm group border border-indigo-100/50"
                : "group flex items-center px-4 py-3 hover:bg-slate-50 hover:text-slate-900 text-slate-500 rounded-2xl font-medium transition-all duration-300 hover:translate-x-1"
            }
          >
            <Settings className="h-5 w-5 mr-3 group-hover:scale-110 group-hover:rotate-45 transition-all duration-300" />
            System Settings
          </NavLink>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={logout}
          className="group flex items-center w-full px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-2xl font-medium transition-all duration-300 hover:translate-x-1"
        >
          <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
