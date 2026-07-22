import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { useNotice } from '@/context/notice-context';
import { useUser } from '@/context/user-context';
import type { MenuItem, MenuItemAddon } from '@/constants/menu-data';

export type CartLine = {
  item: MenuItem;
  qty: number;
  addons: MenuItemAddon[];
  instructions: string;
};

const GUEST_LIMIT_MESSAGE = 'Guest orders are limited to 1 item — log in or sign up to order more.';

export const PROMO_CODE = 'ZONE20';
export const PROMO_DISCOUNT_RATE = 0.2;
export const TAX_RATE = 0.01;

type CartContextValue = {
  cart: CartLine[];
  addToCart: (item: MenuItem, qty: number, addons: MenuItemAddon[], instructions: string) => boolean;
  updateQty: (index: number, delta: number) => void;
  removeItem: (index: number) => void;
  replaceCart: (lines: CartLine[]) => void;
  clearCart: () => void;
  promo: string;
  setPromo: (promo: string) => void;
  promoApplied: boolean;
  applyPromo: () => void;
  subtotal: number;
  discount: number;
  tax: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const { user } = useUser();
  const { showNotice } = useNotice();

  const addToCart = useCallback(
    (item: MenuItem, qty: number, addons: MenuItemAddon[], instructions: string) => {
      const currentCount = cart.reduce((s, c) => s + c.qty, 0);
      if (user?.guest && currentCount >= 1) {
        showNotice(GUEST_LIMIT_MESSAGE);
        return false;
      }
      const cappedQty = user?.guest ? 1 : qty;
      setCart((c) => [...c, { item, qty: cappedQty, addons, instructions }]);
      return true;
    },
    [cart, user, showNotice],
  );

  const updateQty = useCallback(
    (index: number, delta: number) => {
      setCart((c) =>
        c.map((line, i) => {
          if (i !== index) return line;
          if (user?.guest && delta > 0) {
            showNotice(GUEST_LIMIT_MESSAGE);
            return line;
          }
          return { ...line, qty: Math.max(1, line.qty + delta) };
        }),
      );
    },
    [user, showNotice],
  );

  const removeItem = useCallback((index: number) => {
    setCart((c) => c.filter((_, i) => i !== index));
  }, []);

  const replaceCart = useCallback((lines: CartLine[]) => {
    setCart(lines);
  }, []);

  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromo('');
    setPromoApplied(false);
  }, []);

  const applyPromo = useCallback(() => {
    if (promo.trim().toUpperCase() === PROMO_CODE) setPromoApplied(true);
  }, [promo]);

  const subtotal = useMemo(
    () =>
      cart.reduce((s, line) => {
        const addonsTotal = line.addons.reduce((a, x) => a + x.p, 0);
        return s + (line.item.price + addonsTotal) * line.qty;
      }, 0),
    [cart],
  );
  const discount = promoApplied ? subtotal * PROMO_DISCOUNT_RATE : 0;
  const tax = subtotal * TAX_RATE;

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQty,
      removeItem,
      replaceCart,
      clearCart,
      promo,
      setPromo,
      promoApplied,
      applyPromo,
      subtotal,
      discount,
      tax,
    }),
    [
      cart,
      addToCart,
      updateQty,
      removeItem,
      replaceCart,
      clearCart,
      promo,
      promoApplied,
      applyPromo,
      subtotal,
      discount,
      tax,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
