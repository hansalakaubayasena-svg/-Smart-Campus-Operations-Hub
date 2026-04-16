// src/pages/admin/NotificationPage.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Send,
  Bell,
  List,
  Search,
  Trash2,
  Pencil,
  Check,
  X,
  BookOpen,
  Ticket,
  Megaphone,
  Users,
  User,
  ShieldCheck,
  Globe,
  Loader2,
} from "lucide-react";
import {
  adminSendNotification,
  adminFetchAllNotifications,
  adminUpdateNotification,
  adminDeleteNotification,
} from "../../services/notifications/notificationApi";

// ── Constants ─────────────────────────────────────────────────────────────────

const BOOKING_TYPES = [
  { value: "BOOKING_PENDING", label: "Booking Pending" },
  { value: "BOOKING_APPROVED", label: "Booking Approved" },
  { value: "BOOKING_REJECTED", label: "Booking Rejected" },
  { value: "BOOKING_CANCELLED", label: "Booking Cancelled" },
];

const TICKET_TYPES = [
  { value: "TICKET_OPEN", label: "Ticket Opened" },
  { value: "TICKET_IN_PROGRESS", label: "Ticket In Progress" },
  { value: "TICKET_RESOLVED", label: "Ticket Resolved" },
  { value: "TICKET_CLOSED", label: "Ticket Closed" },
  { value: "TICKET_REJECTED", label: "Ticket Rejected" },
];

const TARGET_MODES = [
  { value: "USER", label: "Individual User", icon: User },
  { value: "SELECTED", label: "Selected Users", icon: Users },
  { value: "ROLE", label: "By Role", icon: ShieldCheck },
  { value: "ALL", label: "Everyone", icon: Globe },
];

const categoryMeta = {
  BOOKING: { icon: BookOpen, colour: "text-accent-amber" },
  TICKET: { icon: Ticket, colour: "text-red-500" },
  GENERAL: { icon: Megaphone, colour: "text-primary-900" },
};

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Toast ─────────────────────────────────────────────────────────────────────

const Toast = ({ msg, ok, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold animate-slide-up ${
        ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      {msg}
    </div>
  );
};

// ── Send Tab ──────────────────────────────────────────────────────────────────

const SendTab = () => {
  const [category, setCategory] = useState("GENERAL");
  const [notifType, setNotifType] = useState("");
  const [targetMode, setTargetMode] = useState("ALL");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const typeOptions =
    category === "BOOKING"
      ? BOOKING_TYPES
      : category === "TICKET"
        ? TICKET_TYPES
        : [];

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setToast({ msg: "Title and message are required", ok: false });
      return;
    }

    setSending(true);
    try {
      await adminSendNotification({
        title: title.trim(),
        message: message.trim(),
        category,
        type: notifType || category,
        targetType: targetMode,
      });
      setToast({ msg: "Notification sent successfully!", ok: true });
      setTitle("");
      setMessage("");
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to send notification",
        ok: false,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Category
        </label>
        <div className="flex gap-2">
          {["BOOKING", "TICKET", "GENERAL"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setNotifType("");
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {category !== "GENERAL" && typeOptions.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Notification Type
          </label>
          <select
            value={notifType}
            onChange={(e) => setNotifType(e.target.value)}
            className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          >
            <option value="">Select a type...</option>
            {typeOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Target Audience
        </label>
        <div className="flex gap-2 flex-wrap">
          {TARGET_MODES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTargetMode(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                targetMode === value
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notification title"
          className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Notification message"
          rows="4"
          className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={sending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Notification
          </>
        )}
      </button>

      {toast && (
        <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />
      )}
    </div>
  );
};

// ── All Tab ───────────────────────────────────────────────────────────────────

const AllTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await adminFetchAllNotifications();
      setNotifications(data || []);
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to load notifications",
        ok: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setToast({ msg: "Notification deleted", ok: true });
    } catch (err) {
      setToast({
        msg: err.response?.data?.message || "Failed to delete notification",
        ok: false,
      });
    }
  };

  const filtered = notifications.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notifications…"
          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No notifications found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const meta = categoryMeta[n.category] || categoryMeta.GENERAL;
            const Icon = meta.icon;
            return (
              <div
                key={n.id}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Icon className={`h-5 w-5 ${meta.colour}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const NotificationsPage = () => {
  const [tab, setTab] = useState("send");

  return (
    <>
      {/* Page header */}
      <div className="mb-6 animate-slide-up">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="h-6 w-6 text-accent-amber" /> Manage Notifications
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Send targeted notifications and manage all platform alerts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "send", label: "Send Notification", icon: Send },
          { key: "all", label: "All Notifications", icon: List },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === key
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {tab === "send" && <SendTab />}
        {tab === "all" && <AllTab />}
      </div>
    </>
  );
};

export default NotificationsPage;
