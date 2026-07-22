import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { CartLine } from '@/context/cart-context';
import { useNotifications } from '@/context/notifications-context';
import { useUser } from '@/context/user-context';

export type OrderStatus = 'sent' | 'delivered';
export type OrderFulfillment = 'delivery' | 'pickup' | 'dinein';
export type OrderPayment = 'ecocash' | 'cod';

export type Order = {
  number: number;
  total: number;
  prepTime: string;
  payment: OrderPayment;
  fulfillment: OrderFulfillment;
  date: string;
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
  addOrder: (order: NewOrder) => Order;
  markDelivered: (orderNumber: number) => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [points, setPoints] = useState(0);
  const { user } = useUser();
  const { addNotification } = useNotifications();

  const addOrder = useCallback((order: NewOrder): Order => {
    const record: Order = {
      number: 2000 + Math.floor(Math.random() * 900),
      total: order.total,
      prepTime: '25–35 min',
      payment: order.payment,
      fulfillment: order.fulfillment,
      date: 'Today',
      items: order.items,
      status: 'sent',
    };
    setOrders((prev) => [record, ...prev]);
    return record;
  }, []);

  const markDelivered = useCallback(
    // NOTE: this is a stand-in for a real fulfillment flow. In production,
    // "delivered" should be confirmed from the restaurant/driver side (e.g.
    // a Cloud Function triggered by staff scanning the order or a courier
    // marking it complete) and pushed to the customer — a self-reported
    // "I got my order" tap from the customer is trivially gameable for
    // free loyalty points, since nothing here verifies delivery actually
    // happened.
    (orderNumber: number) => {
      const target = orders.find((o) => o.number === orderNumber);
      if (!target || target.status === 'delivered') return;

      setOrders((prev) =>
        prev.map((order) =>
          order.number === orderNumber ? { ...order, status: 'delivered' } : order,
        ),
      );

      if (!user?.guest) {
        const earned = Math.round(target.total);
        setPoints((p) => p + earned);
        addNotification(
          'Points earned',
          `You earned ${earned} points — Order #${orderNumber} was delivered.`,
          'points',
        );
      }
    },
    [orders, user, addNotification],
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
