import React, { useEffect } from "react";
import { useAuth } from "../../context/AouthContext";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const typeStyles = {
  project: { dot: "bg-blue-500",  badge: "bg-blue-100 text-blue-700",  label: "Project" },
  task:    { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700", label: "Task"    },
  info:    { dot: "bg-gray-400",  badge: "bg-gray-100 text-gray-600",   label: "Info"    },
};

const Notifications = () => {
  const { user } = useAuth();
  const { getNotificationsForUser, markAsRead, markAllAsRead, fetchNotifications } = useNotification();
  const navigate = useNavigate();

  // Re-fetch on mount so we always show latest from db
  useEffect(() => {
    fetchNotifications();
  }, []);

  const notifications = getNotificationsForUser(user?.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (iso) => {
    const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div className="p-6 md:w-180">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-black transition text-lg"
          >←</button>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead(user?.id)}
            className="text-sm text-gray-500 hover:text-black transition underline underline-offset-2"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow divide-y overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <span className="text-4xl">🔔</span>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const style = typeStyles[notif.type] || typeStyles.info;
            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`flex items-start gap-4 p-4 cursor-pointer transition hover:bg-gray-50
                  ${!notif.read ? "bg-blue-50/40" : ""}`}
              >
                {/* Color dot */}
                <div className="mt-1.5 shrink-0">
                  <span className={`block w-2.5 h-2.5 rounded-full ${
                    notif.read ? "bg-gray-200" : style.dot
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                      {style.label}
                    </span>
                    {!notif.read && (
                      <span className="text-xs text-blue-500 font-medium">New</span>
                    )}
                  </div>
                  <p className={`text-sm ${notif.read ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
                </div>

                {/* Unread right dot */}
                {!notif.read && (
                  <div className="shrink-0 mt-2">
                    <span className="block w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;