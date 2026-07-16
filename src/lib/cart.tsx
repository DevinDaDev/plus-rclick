"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getDeviceById } from "@/data/devices";

export interface CartItem {
  deviceId: string;
  qty: number;
}

// TODO: flat CA sales-tax estimate until Stripe Tax is wired (Stage 6).
export const TAX_RATE = 0.0775;

// TODO: move to Supabase in Stage 2.
const DISCOUNT_CODES: Record<string, number> = {
  RCLAUNCH10: 0.1,
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  discountCode: string | null;
  addItem: (deviceId: string) => void;
  removeItem: (deviceId: string) => void;
  setQty: (deviceId: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string) => boolean;
  clearDiscount: () => void;
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  count: number;
}

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "rc-plus-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.items)) {
          setItems(saved.items.filter((i: CartItem) => getDeviceById(i.deviceId)));
        }
        if (typeof saved.discountCode === "string" && DISCOUNT_CODES[saved.discountCode]) {
          setDiscountCode(saved.discountCode);
        }
      }
    } catch {
      // corrupted cart — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, discountCode }));
  }, [items, discountCode, hydrated]);

  const value = useMemo<CartState>(() => {
    const subtotal = items.reduce((sum, item) => {
      const device = getDeviceById(item.deviceId);
      return sum + (device ? device.price * item.qty : 0);
    }, 0);
    const discountAmount = discountCode
      ? subtotal * (DISCOUNT_CODES[discountCode] ?? 0)
      : 0;
    const taxable = subtotal - discountAmount;
    const tax = taxable * TAX_RATE;

    return {
      items,
      isOpen,
      discountCode,
      addItem: (deviceId) => {
        setItems((prev) => {
          const existing = prev.find((i) => i.deviceId === deviceId);
          if (existing) {
            return prev.map((i) =>
              i.deviceId === deviceId ? { ...i, qty: i.qty + 1 } : i,
            );
          }
          return [...prev, { deviceId, qty: 1 }];
        });
        setIsOpen(true);
      },
      removeItem: (deviceId) =>
        setItems((prev) => prev.filter((i) => i.deviceId !== deviceId)),
      setQty: (deviceId, qty) =>
        setItems((prev) =>
          qty < 1
            ? prev.filter((i) => i.deviceId !== deviceId)
            : prev.map((i) => (i.deviceId === deviceId ? { ...i, qty } : i)),
        ),
      clear: () => {
        setItems([]);
        setDiscountCode(null);
      },
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      applyDiscount: (code) => {
        const normalized = code.trim().toUpperCase();
        if (DISCOUNT_CODES[normalized]) {
          setDiscountCode(normalized);
          return true;
        }
        return false;
      },
      clearDiscount: () => setDiscountCode(null),
      subtotal,
      discountAmount,
      tax,
      total: taxable + tax,
      count: items.reduce((n, i) => n + i.qty, 0),
    };
  }, [items, isOpen, discountCode]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
