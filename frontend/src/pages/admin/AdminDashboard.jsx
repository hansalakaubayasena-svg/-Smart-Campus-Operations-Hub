// src/pages/admin/AdminDashboard.jsx
import {
  MapPin,
  CalendarCheck,
  MessagesSquare,
  Users,
  Activity,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Welcome */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.fullName?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            System-wide metrics and facility status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
            <Activity className="h-4 w-4 mr-1.5" />
            System Healthy
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up delay-75 group">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary-900 group-hover:scale-110 group-hover:bg-primary-900 group-hover:text-white transition-all duration-300">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              +12%
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
            142
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            Total Active Resources
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up delay-150 group">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-accent-amber group-hover:scale-110 group-hover:bg-accent-amber group-hover:text-white transition-all duration-300">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              Today
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
            84
          </h3>
          <p className="text-slate-500 text-sm font-medium">Bookings Today</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up delay-200 group">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
              <MessagesSquare className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
              +5 New
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
            17
          </h3>
          <p className="text-slate-500 text-sm font-medium">Open Tickets</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up delay-300 group">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              Active
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
            2,405
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            Total Registered Users
          </p>
        </div>
      </div>

      {/* Resources Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 animate-slide-up delay-400">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
            <Settings className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors text-left">
              📢 Send System Announcement
            </button>
            <button className="w-full px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors text-left">
              👥 Manage User Roles
            </button>
            <button className="w-full px-4 py-3 rounded-xl bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors text-left">
              🔧 System Maintenance
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 animate-slide-up delay-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">System Status</h2>
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">Frontend</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                ✓ Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">Backend API</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                ✓ Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">Database</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                ✓ Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
