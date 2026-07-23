import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useUser } from '@/context/user-context';
import { auth, db } from '@/lib/firebase';

export type NotificationType = 'order' | 'points' | 'account' | 'general';

export type AppNotification = {
  /** Firestore document id for member notifications; a local-only id for guest notifications. */
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date | null;
};

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (title: string, body: string, type?: NotificationType) => void;
  markAllRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function docToNotification(snap: QueryDocumentSnapshot<DocumentData>): AppNotification {
  const data = snap.data({ serverTimestamps: 'estimate' });
  return {
    id: snap.id,
    title: data.title,
    body: data.body,
    type: data.type,
    read: !!data.read,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
  };
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  // Guests never touch Firebase (no Auth session, no user doc) — their
  // notifications live only in memory for the current app session, same as before.
  const [localNotifications, setLocalNotifications] = useState<AppNotification[]>([]);
  const [remoteNotifications, setRemoteNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!db || !user || user.guest) {
      setRemoteNotifications([]);
      return;
    }
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      setRemoteNotifications([]);
      return;
    }
    const notificationsQuery = query(
      collection(db, 'users', uid, 'notifications'),
      orderBy('createdAt', 'desc'),
    );
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      setRemoteNotifications(snapshot.docs.map(docToNotification));
    });
    return unsubscribe;
  }, [user]);

  const notifications = user?.guest ? localNotifications : remoteNotifications;

  const addNotification = useCallback(
    (title: string, body: string, type: NotificationType = 'general') => {
      if (user?.guest) {
        setLocalNotifications((prev) => [
          {
            id: `guest-${Date.now()}-${Math.random()}`,
            title,
            body,
            type,
            read: false,
            createdAt: new Date(),
          },
          ...prev,
        ]);
        return;
      }

      if (!db || !auth?.currentUser) return;
      addDoc(collection(db, 'users', auth.currentUser.uid, 'notifications'), {
        title,
        body,
        type,
        read: false,
        createdAt: serverTimestamp(),
      }).catch(() => {
        // Best-effort — the onSnapshot listener above is the source of
        // truth, so a failed write here just means the notification never
        // shows up.
      });
    },
    [user],
  );

  const markAllRead = useCallback(() => {
    if (user?.guest) {
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      return;
    }

    if (!db || !auth?.currentUser) return;
    const unread = remoteNotifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    const uid = auth.currentUser.uid;
    const batch = writeBatch(db);
    for (const n of unread) {
      batch.update(doc(db, 'users', uid, 'notifications', n.id), { read: true });
    }
    batch.commit().catch(() => {
      // Best-effort — the onSnapshot listener above is the source of truth.
    });
  }, [user, remoteNotifications]);

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
