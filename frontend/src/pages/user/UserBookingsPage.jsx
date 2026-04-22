import React, { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '../../services/bookings/bookingService';
import { Calendar, Clock, MapPin, Trash2, AlertCircle, CheckCircle, Clock3, XCircle, Edit2 } from 'lucide-react';
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

  const loadBookings = async () => {
    try {
      const response = await getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      loadBookings();
    } catch (err) {
      alert('Failed to cancel booking.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your bookings...</div>;

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-sm text-slate-500">Track and manage your facility reservation requests.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex gap-3 text-sm italic items-center">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>You haven't made any booking requests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <StatusBadge status={booking.status} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1 pr-20">{booking.facilityName}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium italic">
                <MapPin className="h-4 w-4" /> Smart Campus Facility
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>
                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="px-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Purpose</p>
                  <p className="text-sm text-slate-700 line-clamp-2 italic">"{booking.purpose}"</p>
                </div>

                {booking.adminNotes && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
                    <span className="font-bold">Admin Notes: </span> {booking.adminNotes}
                  </div>
                )}
              </div>

              {(booking.status === 'APPROVED' || booking.status === 'PENDING' || booking.status === 'REJECTED') && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingBooking(booking)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                  >
                    <Edit2 className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
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
