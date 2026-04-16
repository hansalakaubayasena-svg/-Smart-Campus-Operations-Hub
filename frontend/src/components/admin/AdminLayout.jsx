// src/components/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { Search, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./AdminSideBar";
import NotificationBell from "../notifications/NotificationBell";

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden animate-fade-in">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm z-10 sticky top-0">
          <div className="flex-1 flex max-w-2xl">
            <div className="relative w-full max-w-md hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-900 focus:border-primary-900 sm:text-sm transition-all duration-300"
                placeholder="Search resources, users, or tickets..."
              />
            </div>
          </div>

          <div className="ml-4 flex items-center space-x-4">
            <NotificationBell />

            <div className="flex items-center ml-2 cursor-pointer border-l border-slate-200 pl-4 py-1 group">
              <div className="text-right mr-3 hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-primary-900 transition-colors">
                  {user?.fullName || "Admin"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {user?.role || "ADMIN"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border-2 border-slate-200 shadow-sm transition-all duration-300 group-hover:scale-105">
                <Shield className="h-5 w-5 text-accent-emerald" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
