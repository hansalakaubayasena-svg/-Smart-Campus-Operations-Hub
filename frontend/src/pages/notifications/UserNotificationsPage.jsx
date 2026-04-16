// src/pages/notifications/UserNotificationsPage.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  BookOpen,
  Ticket,
  Megaphone,
  Check,
  Trash2,
  Settings2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
} from "lucide-react";
import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteMyNotification,
} from "../../services/notifications/notificationApi";

// ── Constants ─────────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { key: "ALL", label: "All" },
  { key: "BOOKING", label: "Bookings" },
  { key: "TICKET", label: "Tickets" },
  { key: "GENERAL", label: "General" },
];

const categoryMeta = {
  BOOKING: {
    icon: BookOpen,
    colour: "text-blue-600",
    bg: "bg-blue-50",
    gradientBg: "from-blue-50 via-blue-50 to-cyan-50",
    gradientHover: "from-blue-400 via-blue-500 to-cyan-500",
    iconBg: "bg-white/40 group-hover:bg-white",
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-600",
  },
  TICKET: {
    icon: Ticket,
    colour: "text-red-600",
    bg: "bg-red-50",
    gradientBg: "from-red-50 via-orange-50 to-rose-50",
    gradientHover: "from-red-400 via-orange-500 to-rose-500",
    iconBg: "bg-white/40 group-hover:bg-white",
    badge: "bg-red-100 text-red-800",
    dot: "bg-red-600",
  },
  GENERAL: {
    icon: Megaphone,
    colour: "text-indigo-600",
    bg: "bg-indigo-50",
    gradientBg: "from-indigo-50 via-purple-50 to-indigo-50",
    gradientHover: "from-indigo-400 via-purple-500 to-indigo-600",
    iconBg: "bg-white/40 group-hover:bg-white",
    badge: "bg-indigo-100 text-indigo-800",
    dot: "bg-indigo-600",
  },
};

const DEFAULT_PREFS = { BOOKING: true, TICKET: true, GENERAL: true };
const PREFS_KEY = "notif_prefs";

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw
      ? { ...DEFAULT_PREFS, ...JSON.parse(raw) }
      : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

// ── Toast ─────────────────────────────────────────────────────────────────────

const Toast = ({ msg, ok, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
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

// ── Main Component ────────────────────────────────────────────────────────────

const UserNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState(loadPrefs);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => setToast({ msg, ok });

  // Load notifications
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyNotifications();
      setNotifications(data);
    } catch {
      showToast("Failed to load notifications", false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Apply preferences + tab filter + unread filter
  const visible = notifications.filter((n) => {
    if (!prefs[n.category]) return false; // preference toggle
    if (activeTab !== "ALL" && n.category !== activeTab) return false; // tab filter
    if (showUnreadOnly && n.isRead) return false; // unread-only toggle
    return true;
  });

  const unreadCount = notifications.filter(
    (n) => !n.isRead && prefs[n.category],
  ).length;

  // Mark single as read
  const handleRead = async (n) => {
    if (n.isRead) return;
    try {
      await markNotificationRead(n.id);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
    } catch {
      showToast("Failed to mark as read", false);
    }
  };

  // Mark all as read
  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
      showToast("All marked as read");
    } catch {
      showToast("Failed", false);
    }
  };

  // Delete
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteMyNotification(id);
      setNotifications((prev) => prev.filter((x) => x.id !== id));
      showToast("Notification deleted");
    } catch {
      showToast("Delete failed", false);
    }
  };

  // Toggle preference
  const togglePref = (cat) => {
    setPrefs((prev) => {
      const next = { ...prev, [cat]: !prev[cat] };
      savePrefs(next);
      return next;
    });
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-600" />
              My Notifications
              {unreadCount > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-accent-amber text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Your booking alerts, ticket updates, and messages.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Check className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
            <button
              onClick={() => setShowPrefs((p) => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-xl transition-colors ${
                showPrefs
                  ? "bg-slate-900 text-white border-slate-900"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Settings2 className="h-3.5 w-3.5" /> Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Preferences panel */}
      {showPrefs && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 animate-slide-up">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Notification Preferences
          </h3>
          <p className="text-sm text-slate-500 mb-6 font-medium">
            Toggle which categories appear in your notification list and bell dropdown. Turned-off categories are hidden but not deleted.
          </p>
          <div className="space-y-4">
            {[
              {
                cat: "BOOKING",
                label: "Booking Notifications",
                desc: "Approval, rejection, cancellation alerts",
              },
              {
                cat: "TICKET",
                label: "Ticket Notifications",
                desc: "Status changes, assignments, new comments",
              },
              {
                cat: "GENERAL",
                label: "General Notifications",
                desc: "Announcements and messages from admins",
              },
            ].map(({ cat, label, desc }) => {
              const meta = categoryMeta[cat];
              const Icon = meta.icon;
              return (
                <div
                  key={cat}
                  className="relative rounded-2xl p-5 overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-15 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, var(--color-start), var(--color-end))` }} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradientBg}`} />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl ${meta.iconBg} backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300`}>
                        <Icon className={`h-5 w-5 ${meta.colour}`} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          {label}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePref(cat)}
                      className="transition-transform duration-300 hover:scale-125 flex-shrink-0"
                      aria-label={`Toggle ${label}`}
                    >
                      {prefs[cat] ? (
                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                          <ToggleRight className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center shadow-lg">
                          <ToggleLeft className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        {/* Category tabs */}
        <div className="flex gap-2">
          {FILTER_TABS.map(({ key, label }) => {
            const meta = key !== "ALL" ? categoryMeta[key] : null;
            const count =
              key === "ALL"
                ? notifications.filter((n) => prefs[n.category]).length
                : notifications.filter(
                    (n) => n.category === key && prefs[n.category],
                  ).length;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                disabled={key !== "ALL" && !prefs[key]}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  !prefs[key] && key !== "ALL"
                    ? "opacity-40 cursor-not-allowed border-slate-100 text-slate-400"
                    : activeTab === key
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {meta && <meta.icon className="h-3.5 w-3.5" />}
                {label}
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === key
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Unread toggle */}
        <button
          onClick={() => setShowUnreadOnly((p) => !p)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-xl transition-all duration-200 ${
            showUnreadOnly
              ? "bg-accent-amber text-white border-accent-amber"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {showUnreadOnly ? (
            <ToggleRight className="h-4 w-4" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
          Unread only
        </button>
      </div>

      {/* Notification list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-fade-in">
          <Bell className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No notifications here</p>
          <p className="text-xs mt-1">
            {!prefs.BOOKING && !prefs.TICKET && !prefs.GENERAL
              ? "All categories are hidden in preferences"
              : "Check back later"}
          </p>
        </div>
      ) : (
        <div className="space-y-2 animate-fade-in">
          {visible.map((n) => {
            const meta = categoryMeta[n.category] ?? categoryMeta.GENERAL;
            const Icon = meta.icon;
            return (
              <div
                key={n.id}
                onClick={() => handleRead(n)}
                className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-sm hover:-translate-y-0.5 ${
                  !n.isRead
                    ? "bg-blue-50/40 border-blue-100 hover:bg-blue-50/60"
                    : "bg-white border-slate-100 hover:bg-slate-50"
                }`}
              >
                {/* Icon */}
                <div
                  className={`h-10 w-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className={`h-5 w-5 ${meta.colour}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badge}`}
                    >
                      {n.type.replace(/_/g, " ")}
                    </span>
                    {!n.isRead && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${meta.dot} flex-shrink-0`}
                      />
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-900">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {!n.isRead && (
                    <span className="text-[10px] font-bold text-accent-amber bg-amber-50 px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                  <button
                    onClick={(e) => handleDelete(n.id, e)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />
      )}
    </>
  );
};

export default UserNotificationsPage;
