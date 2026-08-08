"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type StoreItem = {
  id: number;
  slug: string;
  title: string;
  coverImageUrl: string | null;
  price: number | null;
  currency: string;
};

type CartItem = StoreItem & { qty: number };

type StoreContextValue = {
  cart: CartItem[];
  favorites: StoreItem[];
  addToCart: (item: StoreItem) => void;
  removeFromCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  cartCount: number;
  cartTotal: number;
  toggleFavorite: (item: StoreItem) => void;
  isFavorite: (id: number) => boolean;
  favoritesCount: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "store:cart";
const FAVORITES_KEY = "store:favorites";

function readStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<StoreItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readStorage<CartItem>(CART_KEY));
    setFavorites(readStorage<StoreItem>(FAVORITES_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const addToCart = useCallback((item: StoreItem) => {
    setCart((current) => {
      const existing = current.find((row) => row.id === item.id);
      if (existing) {
        return current.map((row) => (row.id === item.id ? { ...row, qty: row.qty + 1 } : row));
      }
      return [...current, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((current) => current.filter((row) => row.id !== id));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setCart((current) =>
      current.map((row) => (row.id === id ? { ...row, qty: Math.max(1, qty) } : row))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const isInCart = useCallback((id: number) => cart.some((row) => row.id === id), [cart]);

  const toggleFavorite = useCallback((item: StoreItem) => {
    setFavorites((current) => {
      const exists = current.some((row) => row.id === item.id);
      if (exists) return current.filter((row) => row.id !== item.id);
      return [...current, item];
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.some((row) => row.id === id), [favorites]);

  const cartCount = useMemo(() => cart.reduce((sum, row) => sum + row.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, row) => sum + (row.price || 0) * row.qty, 0),
    [cart]
  );

  const value: StoreContextValue = {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    isInCart,
    cartCount,
    cartTotal,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}
