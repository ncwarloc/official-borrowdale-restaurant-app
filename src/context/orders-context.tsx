import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { CartLine } from '@/context/cart-context';
import { useNotifications } from '@/context/notifications-context';
import { useUser } from '@/context/user-context';
import { auth, db } from '@/lib/firebase';

export type OrderStatus = 'sent' | 'delivered';
export type OrderFulfillment = 'delivery' | 'pickup' | 'dinein';
export type OrderPayment = 'ecocash' | 'cod';

export type Order = {
  /** Firestore document id for member orders; a local-only id for guest orders. */
  id: string;
  number: number;
  userId: string;
  total: number;
  prepTime: string;
  payment: OrderPayment;
  fulfillment: OrderFulfillment;
  createdAt: Date | null;
  items: CartLine[];
  status: OrderStatus;
};

type NewOrder = {
  total: number;
  payment: OrderPayment;
  fulfillment: OrderFulfillment;
  items: CartLine[];
};

type OrdersContextValue = {
  orders: Order[];
  points: number;
  addOrder: (order: NewOrder) => Promise<Order>;
  markDelivered: (orderId: string) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

function docToOrder(snap: QueryDocumentSnapshot<DocumentData>): Order {
  const data = snap.data({ serverTimestamps: 'estimate' });
  return {
    id: snap.id,
    number: data.number,
    userId: data.userId,
    total: data.total,
    prepTime: data.prepTime,
    payment: data.payment,
    fulfillment: data.fulfillment,
    items: data.items,
    status: data.status,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
  };
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { addNotification } = useNotifications();

  // Guests never touch Firebase (no Auth session to key a document on) — their
  // orders live only in memory for the current app session, same as before.
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [remoteOrders, setRemoteOrders] = useState<Order[]>([]);

  // Points are NEVER incremented from the app — only a Cloud Function
  // (triggered when an order's status flips to "delivered") writes
  // users/{uid}.points. This just reflects that field reactively.
  const [points, setPoints] = useState(0);
  const previousPointsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!db || !user || user.guest) {
      setRemoteOrders([]);
      return;
    }
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      setRemoteOrders([]);
      return;
    }
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
    );
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      setRemoteOrders(snapshot.docs.map(docToOrder));
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!db || !user || user.guest) {
      setPoints(0);
      previousPointsRef.current = null;
      return;
    }
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      setPoints(0);
      previousPointsRef.current = null;
      return;
    }
    const unsubscribe = onSnapshot(doc(db, 'users', uid), (snap) => {
      const nextPoints = typeof snap.data()?.points === 'number' ? snap.data()!.points : 0;
      const previousPoints = previousPointsRef.current;
      if (previousPoints !== null && nextPoints > previousPoints) {
        addNotification(
          'Points earned',
          `You earned ${nextPoints - previousPoints} points — your order was delivered.`,
          'points',
        );
      }
      previousPointsRef.current = nextPoints;
      setPoints(nextPoints);
    });
    return unsubscribe;
  }, [user, addNotification]);

  const orders = user?.guest ? localOrders : remoteOrders;

  const addOrder = useCallback(
    async (input: NewOrder): Promise<Order> => {
      const number = 2000 + Math.floor(Math.random() * 900);
      const prepTime = '25–35 min';

      if (user?.guest) {
        const record: Order = {
          id: `guest-${Date.now()}-${number}`,
          number,
          userId: '',
          total: input.total,
          prepTime,
          payment: input.payment,
          fulfillment: input.fulfillment,
          items: input.items,
          status: 'sent',
          createdAt: new Date(),
        };
        setLocalOrders((prev) => [record, ...prev]);
        return record;
      }

      if (!db || !auth?.currentUser) {
        throw new Error('You must be logged in to place an order.');
      }
      const uid = auth.currentUser.uid;
      const ref = await addDoc(collection(db, 'orders'), {
        userId: uid,
        number,
        total: input.total,
        prepTime,
        payment: input.payment,
        fulfillment: input.fulfillment,
        items: input.items,
        status: 'sent',
        createdAt: serverTimestamp(),
      });

      return {
        id: ref.id,
        number,
        userId: uid,
        total: input.total,
        prepTime,
        payment: input.payment,
        fulfillment: input.fulfillment,
        items: input.items,
        status: 'sent',
        createdAt: new Date(),
      };
    },
    [user],
  );

  const markDelivered = useCallback(
    // NOTE: this only ever flips the order's status. Loyalty points are
    // awarded exclusively by a Cloud Function watching for that status
    // change server-side (see functions/src/index.ts,
    // awardPointsOnDelivery) — never incremented here. In production this
    // status flip itself should come from the restaurant/driver side too
    // (e.g. staff scanning the order or a courier marking it complete), not
    // a self-reported "I got my order" tap from the customer, since nothing
    // here verifies delivery actually happened. That's tracked as a
    // follow-up; today the customer-facing tap is what flips the status.
    async (orderId: string) => {
      if (user?.guest) {
        const target = localOrders.find((o) => o.id === orderId);
        if (!target || target.status === 'delivered') return;
        setLocalOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'delivered' } : o)),
        );
        return;
      }

      if (!db) return;
      const target = remoteOrders.find((o) => o.id === orderId);
      if (!target || target.status === 'delivered') return;

      await updateDoc(doc(db, 'orders', orderId), { status: 'delivered' });
    },
    [user, localOrders, remoteOrders],
  );

  const value = useMemo(
    () => ({ orders, points, addOrder, markDelivered }),
    [orders, points, addOrder, markDelivered],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within an OrdersProvider');
  return ctx;
}
