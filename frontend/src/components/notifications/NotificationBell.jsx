// src/components/notifications/NotificationBell.jsx
import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, BookOpen, Ticket, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchUnreadCount,
  fetchBellNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notifications/notificationApi";

// icon + colour per category
const categoryMeta = {
  BOOKING: { icon: BookOpen, colour: "text-accent-amber", bg: "bg-amber-50" },
  TICKET: { icon: Ticket, colour: "text-red-500", bg: "bg-red-50" },
  GENERAL: { icon: Megaphone, colour: "text-primary-900", bg: "bg-blue-50" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN";

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Poll unread count every 30 seconds
  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        const c = await fetchUnreadCount();
        if (mounted) setCount(c);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // Load bell items when dropdown opens
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchBellNotifications()
      .then(setRecent)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleItemClick = async (n) => {
    if (!n.isRead) {
      try {
        await markNotificationRead(n.id);
        setRecent((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
        );
        setCount((c) => Math.max(0, c - 1));
      } catch {}
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setRecent((prev) => prev.map((x) => ({ ...x, isRead: true })));
      setCount(0);
    } catch {}
  };

  const viewAll = () => {
    setOpen(false);
    navigate(isAdmin ? "/admin/notifications" : "/user/notifications");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 text-slate-400 hover:text-primary-900 relative transition-colors duration-300 hover:scale-110"
        aria-label="Notifications"
      >
        {count > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-accent-amber border-2 border-white flex items-center justify-center">
            <span className="text-[9px] font-bold text-white leading-none">
              {count > 9 ? "9+" : count}
            </span>
          </span>
        )}
        {count === 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-accent-amber border-2 border-white animate-pulse" />
        )}
        <Bell className="h-5 w-5" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            {count > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs font-semibold text-primary-900 hover:text-primary-700 transition-colors"
              >
                <Check className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Items */}
          <div className="max-h-72 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 rounded-full border-2 border-primary-900 border-t-transparent animate-spin" />
              </div>
            )}

            {!loading && recent.length === 0 && (
              <div className="py-8 text-center text-sm text-slate-400">
                No notifications yet
              </div>
            )}

            {!loading &&
              recent.map((n) => {
                const meta = categoryMeta[n.category] ?? categoryMeta.GENERAL;
                const Icon = meta.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${
                      !n.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Icon className={`h-4 w-4 ${meta.colour}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-amber flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100">
            <button
              onClick={viewAll}
              className="w-full text-xs font-semibold text-primary-900 hover:text-primary-700 transition-colors text-center"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
