import React, { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '../../services/bookings/bookingService';
import { Calendar, Clock, MapPin, Trash2, AlertCircle, CheckCircle, Clock3, XCircle, Edit2, Search } from 'lucide-react';
import { BookingModal } from '../../components/bookings/BookingModal';

const StatusBadge = ({ status }) => {
  const configs = {
    PENDING: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock3 },
    APPROVED: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    REJECTED: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    CANCELLED: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Trash2 },
  };

  const config = configs[status] || configs.PENDING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
};

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const loadBookings = async (search = '') => {
    console.log("FRONTEND: Calling getMyBookings with search:", search);
    try {
      const response = await getMyBookings(search);
      setBookings(response.data);
      
      // Update suggestions from purposes if not searching
      if (!search) {
        const uniquePurposes = [...new Set(response.data.map(b => b.purpose))];
        setSuggestions(uniquePurposes);
      }
    } catch (err) {
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search - handles both initial load and subsequent searches
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadBookings(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      loadBookings(searchTerm);
    } catch (err) {
      alert('Failed to cancel booking.');
    }
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(searchTerm.toLowerCase()) && s !== searchTerm
  ).slice(0, 5);

  if (loading && bookings.length === 0) return <div className="p-8 text-center text-slate-500 italic">Loading your bookings...</div>;

  return (
    <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 mt-1 text-base">Track and manage your facility reservation requests.</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by purpose..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {showSuggestions && searchTerm && filteredSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {filteredSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  <Search className="h-3.5 w-3.5 opacity-30" />
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex gap-3 text-sm font-medium animate-in zoom-in-95">
          <AlertCircle className="h-5 w-5 shrink-0" /> {error}
        </div>
      )}

      {bookings.length === 0 && !searchTerm ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-16 text-center text-slate-400 animate-in zoom-in-95 duration-500">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 opacity-30" />
          </div>
          <p className="text-lg font-medium text-slate-500">You haven't made any booking requests yet.</p>
          <button onClick={() => window.location.href='/user/facilities'} className="mt-4 text-blue-600 font-semibold hover:underline">Browse facilities</button>
        </div>
      ) : bookings.length === 0 && searchTerm ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 animate-in fade-in duration-300">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 opacity-20" />
          </div>
          <p className="text-lg font-medium text-slate-500">No bookings match your search "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className="mt-2 text-blue-600 font-semibold hover:underline text-sm">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bookings.map((booking, index) => (
            <div 
              key={booking.id} 
              className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute top-0 right-0 p-6">
                <StatusBadge status={booking.status} />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1 pr-24 leading-tight group-hover:text-blue-600 transition-colors">
                  {booking.facilityName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 font-medium">
                  <MapPin className="h-3.5 w-3.5" /> Smart Campus Facility
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{new Date(booking.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">
                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Booking Purpose</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-2">"{booking.purpose}"</p>
                  </div>

                  {booking.adminNotes && (
                    <div className="mt-4 p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl text-xs text-amber-800 leading-relaxed">
                      <span className="font-bold text-amber-900">Admin Response: </span> {booking.adminNotes}
                    </div>
                  )}
                </div>
              </div>

              {(booking.status === 'APPROVED' || booking.status === 'PENDING' || booking.status === 'REJECTED') && (
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => setEditingBooking(booking)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-300 active:scale-95"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Details
                  </button>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-2xl transition-all duration-300 active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <BookingModal 
        isOpen={!!editingBooking}
        onClose={() => {
          setEditingBooking(null);
          loadBookings();
        }}
        initialData={editingBooking}
      />
    </div>
  );
};

export default UserBookingsPage;
