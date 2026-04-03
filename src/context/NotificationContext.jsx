import { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificationContext = createContext();
const NOTIF_API = "http://localhost:3001/notifications";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(NOTIF_API);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = useCallback(async ({ userId, message, type = "info", projectId }) => {
    const newNotif = {
      userId,
      message,
      type,
      projectId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch(NOTIF_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotif),
      });
      const saved = await res.json();
      setNotifications((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Add notification error:", err);
    }
  }, []);

  const markAsRead = useCallback(async (notifId) => {
    try {
      await fetch(`${NOTIF_API}/${notifId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async (userId) => {
    const unread = notifications.filter((n) => n.userId === userId && !n.read);
    try {
      await Promise.all(
        unread.map((n) =>
          fetch(`${NOTIF_API}/${n.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
          })
        )
      );
      setNotifications((prev) =>
        prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  }, [notifications]);

  const getNotificationsForUser = useCallback(
    (userId) =>
      [...notifications]
        .filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [notifications]
  );

  const getUnreadCount = useCallback(
    (userId) => notifications.filter((n) => n.userId === userId && !n.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        getNotificationsForUser,
        getUnreadCount,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);