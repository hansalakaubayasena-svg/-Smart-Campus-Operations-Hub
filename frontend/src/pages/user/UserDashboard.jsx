// src/pages/user/UserDashboard.jsx
import { Clock, AlertCircle, PlusCircle, Calendar, Ticket } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="mb-8 animate-slide-up">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.fullName?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          Here's what's happening with your campus activities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Pending Bookings */}
        <div className="relative rounded-2xl p-6 overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-100 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-white group-hover:text-blue-700 transition-all duration-300 shadow-lg">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-blue-700 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full group-hover:bg-white transition-all">
                Today
              </span>
            </div>
            <h3 className="text-4xl font-black text-blue-900 mt-4 mb-2 group-hover:text-blue-950 transition-colors">
              2
            </h3>
            <p className="text-blue-700 text-sm font-semibold group-hover:text-blue-800 transition-colors">Pending Bookings</p>
          </div>
          <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-20 h-20 bg-white/10 rounded-full" />
        </div>

        {/* Open Tickets */}
        <div className="relative rounded-2xl p-6 overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-200 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-red-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-rose-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center text-red-600 group-hover:bg-white group-hover:text-red-700 transition-all duration-300 shadow-lg">
                <AlertCircle className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-red-700 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full group-hover:bg-white transition-all">
                Action Required
              </span>
            </div>
            <h3 className="text-4xl font-black text-red-900 mt-4 mb-2 group-hover:text-red-950 transition-colors">
              1
            </h3>
            <p className="text-red-700 text-sm font-semibold group-hover:text-red-800 transition-colors">Open Support Tickets</p>
          </div>
          <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-20 h-20 bg-white/10 rounded-full" />
        </div>

        {/* Quick Book CTA */}
        <div className="relative rounded-2xl p-6 overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300 animate-slide-up delay-300 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-white group-hover:text-indigo-700 transition-all duration-300 shadow-lg">
                <PlusCircle className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full group-hover:bg-white transition-all">
                Quick Access
              </span>
            </div>
            <h3 className="text-4xl font-black text-indigo-900 mt-4 mb-2 group-hover:text-indigo-950 transition-colors">
              Book
            </h3>
            <p className="text-indigo-700 text-sm font-semibold group-hover:text-indigo-800 transition-colors">Reserve a room instantly</p>
          </div>
          <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-20 h-20 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 animate-slide-up delay-400">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 hover:shadow-sm transition-all duration-300 cursor-pointer hover:pl-6"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  {i === 2 ? (
                    <Ticket className="h-5 w-5" />
                  ) : (
                    <Calendar className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {i === 2
                      ? "Submitted IT Support Ticket"
                      : "Booked Group Study Room"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Today at {10 - i}:30 AM
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Approved
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
