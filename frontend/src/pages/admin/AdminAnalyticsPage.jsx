import React, { useEffect, useMemo, useState } from 'react';
import { getAllBookings, getBookingAnalytics } from '../../services/bookings/bookingService';
import { getFacilities } from '../../services/facilities/facilityService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { LayoutDashboard, TrendingUp, BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const PERIOD_OPTIONS = ['daily', 'weekly', 'monthly'];

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const weekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const monthStart = (date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatPeriodLabel = (date, period) => {
  if (period === 'daily') {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  if (period === 'weekly') {
    const end = new Date(date);
    end.setDate(end.getDate() + 6);
    return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  }
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

const buildDemandOverTime = (bookings, period) => {
  const bucketMap = new Map();

  bookings.forEach((booking) => {
    const baseDate = toDate(booking.startTime || booking.createdAt);
    if (!baseDate) return;

    let bucketDate;
    if (period === 'daily') {
      bucketDate = new Date(baseDate);
      bucketDate.setHours(0, 0, 0, 0);
    } else if (period === 'weekly') {
      bucketDate = weekStart(baseDate);
    } else {
      bucketDate = monthStart(baseDate);
    }

    const key = bucketDate.toISOString();
    bucketMap.set(key, (bucketMap.get(key) || 0) + 1);
  });

  const limit = period === 'daily' ? 14 : 12;

  return [...bucketMap.entries()]
    .map(([iso, count]) => ({
      sortDate: new Date(iso),
      periodLabel: formatPeriodLabel(new Date(iso), period),
      bookings: count,
    }))
    .sort((a, b) => a.sortDate - b.sortDate)
    .slice(-limit)
    .map(({ periodLabel, bookings }) => ({ periodLabel, bookings }));
};

const buildCapacityUtilization = (facilities, bookings) => {
  const usageByFacility = bookings.reduce((acc, booking) => {
    const facilityId = booking.facilityId;
    if (!facilityId) return acc;

    const attendees = Number.isFinite(booking.expectedAttendees) ? booking.expectedAttendees : 0;
    if (!acc[facilityId]) {
      acc[facilityId] = { attendeesTotal: 0, bookingCount: 0 };
    }

    acc[facilityId].attendeesTotal += attendees;
    acc[facilityId].bookingCount += 1;
    return acc;
  }, {});

  return facilities
    .filter((facility) => Number.isFinite(facility.capacity) && facility.capacity > 0)
    .map((facility) => {
      const usage = usageByFacility[facility.resourceId] || { attendeesTotal: 0, bookingCount: 0 };
      const avgUsage = usage.bookingCount > 0 ? Math.round(usage.attendeesTotal / usage.bookingCount) : 0;
      const utilizationRate = Math.round((avgUsage / facility.capacity) * 100);

      return {
        name: facility.nameOrModel,
        capacity: facility.capacity,
        avgUsage,
        utilizationRate: Number.isFinite(utilizationRate) ? utilizationRate : 0,
      };
    })
    .sort((a, b) => b.utilizationRate - a.utilizationRate)
    .slice(0, 8);
};

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [trendPeriod, setTrendPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsResponse, bookingsResponse, facilitiesResponse] = await Promise.all([
          getBookingAnalytics(),
          getAllBookings('ALL'),
          getFacilities({ role: 'ADMIN' }),
        ]);

        setAnalytics(analyticsResponse.data);
        setBookings(Array.isArray(bookingsResponse.data) ? bookingsResponse.data : []);
        setFacilities(Array.isArray(facilitiesResponse.data) ? facilitiesResponse.data : []);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalBookings = bookings.length;
  const approvedBookings = bookings.filter((booking) => booking.status === 'APPROVED').length;
  const approvalRate = totalBookings ? `${Math.round((approvedBookings / totalBookings) * 100)}%` : '0%';

  const demandData = useMemo(() => buildDemandOverTime(bookings, trendPeriod), [bookings, trendPeriod]);
  const capacityVsUsage = useMemo(() => buildCapacityUtilization(facilities, bookings), [facilities, bookings]);

  const avgOccupancy = useMemo(() => {
    if (!capacityVsUsage.length) return '0%';
    const total = capacityVsUsage.reduce((sum, item) => sum + item.utilizationRate, 0);
    return `${Math.round(total / capacityVsUsage.length)}%`;
  }, [capacityVsUsage]);

  const peakDemand = useMemo(() => {
    if (!demandData.length) return { periodLabel: 'N/A', bookings: 0 };
    return demandData.reduce((peak, current) => (current.bookings > peak.bookings ? current : peak), demandData[0]);
  }, [demandData]);

  if (loading) return <div className="p-8 text-center text-slate-500 italic">Generating insights...</div>;
  if (!analytics) return <div className="p-8 text-center text-red-500 font-medium">Failed to load analytics.</div>;

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
          <span className="text-sm font-semibold text-slate-600">Live Data Feed</span>
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
          value={avgOccupancy} 
          icon={<TrendingUp className="h-5 w-5" />}
          trend={`${capacityVsUsage.length} tracked`}
          positive={true}
          color="emerald"
        />
        <StatCard 
          title="Peak Period" 
          value={peakDemand.periodLabel} 
          icon={<BarChart3 className="h-5 w-5" />}
          trend={`${peakDemand.bookings} bookings`}
          positive={true}
          color="amber"
        />
        <StatCard 
          title="Approval Rate" 
          value={approvalRate} 
          icon={<PieChartIcon className="h-5 w-5" />}
          trend={`${approvedBookings}/${totalBookings}`}
          positive={true}
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Capacity vs Utilization */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <BarChart3 className="h-32 w-32" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-1">Capacity vs Utilization</h3>
          <p className="text-sm text-slate-500 mb-6">Each facility's total capacity compared with average usage per booking.</p>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityVsUsage} margin={{ top: 20, right: 20, left: 8, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={70}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="capacity" name="Total Capacity" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={18} />
                <Bar dataKey="avgUsage" name="Average Usage" fill="#10b981" radius={[10, 10, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Demand */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Activity className="h-32 w-32" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">Booking Demand Over Time</h3>
              <p className="text-sm text-slate-500">Daily, weekly, and monthly booking trends with peak periods.</p>
            </div>
            <div className="inline-flex bg-slate-100 rounded-xl p-1">
              {PERIOD_OPTIONS.map((period) => (
                <button
                  key={period}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${trendPeriod === period ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setTrendPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="periodLabel" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  interval="preserveStartEnd"
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-slate-500">Peak period: <span className="font-semibold text-slate-700">{peakDemand.periodLabel}</span> ({peakDemand.bookings} bookings)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <PieChartIcon className="h-32 w-32" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-8">Booking Status Distribution</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {(analytics.statusDistribution || []).map((entry, index) => (
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
          <h3 className="text-xl font-semibold text-slate-900 mb-8">Top Requested Facilities</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topFacilities || []} layout="vertical" margin={{ left: 20 }}>
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
                  {(analytics.topFacilities || []).map((entry, index) => (
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
            <h4 className="text-2xl font-semibold mb-2">Smart Campus Efficiency</h4>
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
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
};

export default AdminAnalyticsPage;
