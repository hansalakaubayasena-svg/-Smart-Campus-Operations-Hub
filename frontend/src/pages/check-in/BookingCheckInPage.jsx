import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, MapPin, QrCode, ScanLine, ShieldCheck, Users, Loader2, AlertCircle } from 'lucide-react';
import { confirmBookingCheckIn, getBookingCheckIn } from '../../services/bookings/bookingService';

const BookingCheckInPage = () => {
  const { token } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await getBookingCheckIn(token);
        setBooking(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to verify this booking.');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [token]);

  const handleCheckIn = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await confirmBookingCheckIn(token);
      setBooking(response.data);
      setMessage('Check-in confirmed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete check-in.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verifying booking...
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/95 backdrop-blur-xl shadow-2xl p-8 md:p-10">
          <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Check-in unavailable</h1>
          <p className="mt-3 text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const isCheckedIn = Boolean(booking.checkedInAt);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_42%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl md:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">Smart Campus Hub</p>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Booking Check-in</h1>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${isCheckedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {isCheckedIn ? <CheckCircle className="h-3.5 w-3.5" /> : <QrCode className="h-3.5 w-3.5" />}
                  {isCheckedIn ? 'Checked in' : 'Approved booking'}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  {booking.status}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">{booking.facilityName}</h2>
              <p className="mt-2 text-slate-600">{booking.purpose}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <Calendar className="h-3.5 w-3.5" /> Booking Date
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {new Date(booking.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> Time Slot
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <MapPin className="h-3.5 w-3.5" /> Location
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">Smart Campus Facility</div>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <Users className="h-3.5 w-3.5" /> Expected Attendees
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{booking.expectedAttendees ?? 'N/A'}</div>
                </div>
              </div>

              {booking.checkedInAt && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  Checked in at {new Date(booking.checkedInAt).toLocaleString()}.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 shadow-2xl backdrop-blur-xl md:p-10 text-white">
            <div className="flex items-center gap-3 text-blue-300">
              <ScanLine className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em]">Verification</span>
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight">Confirm the booking at the venue</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This screen confirms the QR payload is valid for an approved booking. Use the button below to record the check-in.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Booking holder</p>
              <p className="mt-2 text-lg font-bold text-white">{booking.userName}</p>
              <p className="mt-1 text-sm text-slate-300 break-all">Token: {booking.checkInToken}</p>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                {message}
              </div>
            )}

            <button
              onClick={handleCheckIn}
              disabled={saving || isCheckedIn}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              {isCheckedIn ? 'Already checked in' : 'Verify and check in'}
            </button>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              If the booking was not approved or the token is invalid, this screen will not allow check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckInPage;
