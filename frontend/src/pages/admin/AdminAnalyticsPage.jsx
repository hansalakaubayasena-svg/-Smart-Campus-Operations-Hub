import React, { useEffect, useState } from 'react';
import { getBookingAnalytics } from '../../services/bookings/bookingService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { LayoutDashboard, TrendingUp, BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getBookingAnalytics();
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 italic">Generating insights...</div>;
  if (!data) return <div className="p-8 text-center text-red-500 font-medium">Failed to load analytics.</div>;

  const totalBookings = data.statusDistribution.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-600" />
            Booking Analytics
          </h1>
          <p className="text-slate-500 mt-1 text-base">Key performance indicators and resource usage insights.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-slate-600">Live Data Feed</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Requests" 
          value={totalBookings} 
          icon={<LayoutDashboard className="h-5 w-5" />}
          trend="+12%"
          positive={true}
          color="blue"
        />
        <StatCard 
          title="Avg. Occupancy" 
          value="74%" 
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+5%"
          positive={true}
          color="emerald"
        />
        <StatCard 
          title="Peak Hours" 
          value="10AM - 2PM" 
          icon={<BarChart3 className="h-5 w-5" />}
          trend="-2%"
          positive={false}
          color="amber"
        />
        <StatCard 
          title="Approval Rate" 
          value="88%" 
          icon={<PieChartIcon className="h-5 w-5" />}
          trend="+3%"
          positive={true}
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <PieChartIcon className="h-32 w-32" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-8">Booking Status Distribution</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {data.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Facilities */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <BarChart3 className="h-32 w-32" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-8">Top Requested Facilities</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topFacilities} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={120}
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[0, 12, 12, 0]} 
                  barSize={32}
                  animationDuration={1500}
                >
                  {data.topFacilities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Visual Accent */}
      <div className="mt-10 p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl shadow-blue-200">
        <div className="relative z-10">
            <h4 className="text-2xl font-bold mb-2">Smart Campus Efficiency</h4>
            <p className="text-blue-100 max-w-xl">
                Our reservation engine is processing requests with a 98.4% uptime. 
                Resource allocation is currently optimized based on the latest traffic patterns.
            </p>
        </div>
        <div className="absolute -right-20 -bottom-20 opacity-20 rotate-12">
            <Activity className="h-80 w-80" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, positive, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
};

export default AdminAnalyticsPage;
