import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type NotificationType = 'order' | 'points' | 'account' | 'general';

export type AppNotification = {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  date: string;
};

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (title: string, body: string, type?: NotificationType) => void;
  markAllRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback(
    (title: string, body: string, type: NotificationType = 'general') => {
      setNotifications((prev) => [
        { id: Date.now() + Math.random(), title, body, type, read: false, date: 'Just now' },
        ...prev,
      ]);
    },
    [],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({ notifications, unreadCount, addNotification, markAllRead }),
    [notifications, unreadCount, addNotification, markAllRead],
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider');
  return ctx;
}
