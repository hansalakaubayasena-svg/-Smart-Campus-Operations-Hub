import React, { useEffect, useState } from 'react';
import { getAllBookings, processBookingAction } from '../../services/bookings/bookingService';
import { 
  Calendar, Clock, CheckCircle, X, Clock3, Users as UsersIcon, 
  Search, Filter, MessageSquare, AlertTriangle 
} from 'lucide-react';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionNotes, setActionNotes] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await getAllBookings(filter);
      setBookings(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const handleAction = async (id, status) => {
    setProcessingId(id);
    try {
      await processBookingAction(id, { 
        status, 
        notes: actionNotes[id] || (status === 'APPROVED' ? 'Approved by admin' : 'Rejected by admin')
      });
      loadData();
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Bookings</h1>
          <p className="text-sm text-slate-500">Review and moderate all facility reservation requests.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Clock3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No booking requests found.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Resource & User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Time Slot</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Purpose</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{booking.facilityName}</div>
                    <div className="text-xs text-blue-600 font-medium">By: {booking.userName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(booking.startTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 max-w-xs line-clamp-2 italic">
                      "{booking.purpose}"
                    </div>
                    {booking.expectedAttendees > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">
                        <UsersIcon className="h-3 w-3" /> {booking.expectedAttendees} Attendees
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      booking.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'PENDING' ? (
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <input 
                          type="text" 
                          placeholder="Note/Reason..."
                          className="text-xs p-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                          value={actionNotes[booking.id] || ''}
                          onChange={(e) => setActionNotes({ ...actionNotes, [booking.id]: e.target.value })}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleAction(booking.id, 'REJECTED')}
                            disabled={processingId === booking.id}
                            className="bg-red-50 text-red-600 p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAction(booking.id, 'APPROVED')}
                            disabled={processingId === booking.id}
                            className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700 shadow-md transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 text-right italic">
                        No actions available
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
