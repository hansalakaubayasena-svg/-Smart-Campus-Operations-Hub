import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, MessageSquare, AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import { createBooking, updateBooking } from '../../services/bookings/bookingService';

export const BookingModal = ({ isOpen, onClose, facility, initialData = null }) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      const start = new Date(initialData.startTime);
      const end = new Date(initialData.endTime);
      
      setFormData({
        date: initialData.startTime.split('T')[0],
        startTime: start.toTimeString().slice(0, 5),
        endTime: end.toTimeString().slice(0, 5),
        purpose: initialData.purpose,
        expectedAttendees: initialData.expectedAttendees
      });
    } else {
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: 1
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const startStr = `${formData.date}T${formData.startTime}:00`;
      const endStr = `${formData.date}T${formData.endTime}:00`;
      
      const start = new Date(startStr);
      const end = new Date(endStr);
      const now = new Date();

      if (start < now) {
        setError('Booking time cannot be in the past.');
        setLoading(false);
        return;
      }

      if (end <= start) {
        setError('End time must be after the start time.');
        setLoading(false);
        return;
      }

      // ── AVAILABILITY WINDOW VALIDATION ─────────────────────────────────────────
      if (facility?.availabilityWindows?.length > 0) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const bookingDay = days[start.getDay()];
        const bookingStartTime = formData.startTime;
        const bookingEndTime = formData.endTime;

        const isAvailable = facility.availabilityWindows.some(window => {
          const match = /^(.+)\s(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(window);
          if (!match) return true; 

          const [_, dayRange, windowStart, windowEnd] = match;
          
          const isDayInRange = (range, day) => {
            if (range.includes(day)) return true;
            if (range === 'Mon-Fri' && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day)) return true;
            if (range === 'Daily') return true;
            return false;
          };

          if (!isDayInRange(dayRange, bookingDay)) return false;
          return bookingStartTime >= windowStart && bookingEndTime <= windowEnd;
        });

        if (!isAvailable) {
          setError(`This resource is only available during: ${facility.availabilityWindows.join(', ')}`);
          setLoading(false);
          return;
        }
      }

      const payload = {
        facilityId: facility?.resourceId || facility?.id || initialData?.facilityId,
        startTime: startStr,
        endTime: endStr,
        purpose: formData.purpose,
        expectedAttendees: parseInt(formData.expectedAttendees)
      };

      if (initialData) {
        await updateBooking(initialData.id, payload);
      } else {
        await createBooking(payload);
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process booking request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? 'Edit Booking' : 'Request Booking'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{facility?.name || initialData?.facilityName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-8 text-center animate-in zoom-in duration-300">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialData ? 'Booking Updated!' : 'Booking Requested!'}
              </h3>
              <p className="text-slate-500 mt-2">
                {initialData ? 'Your changes have been saved and are pending re-approval.' : 'Your request is pending administrator approval.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" /> Start Time
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" /> End Time
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                    {facility?.resourceKind === 'ASSET' || initialData?.resourceKind === 'ASSET' ? (
                      <>Quantity Needed</>
                    ) : (
                      <><Users className="h-4 w-4 text-slate-400" /> Expected Attendees</>
                    )}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    value={formData.expectedAttendees}
                    onChange={(e) => setFormData({...formData, expectedAttendees: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-400" /> Purpose
                  </label>
                  <textarea
                    required
                    rows="3"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    placeholder="Briefly describe the reason for this booking..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (initialData ? 'Update Booking' : 'Confirm Request')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
