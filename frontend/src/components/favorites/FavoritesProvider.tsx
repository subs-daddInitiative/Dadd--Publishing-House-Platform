"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ItemType = "blog" | "study";
type FavoriteKey = `${ItemType}:${number}`;

type FavoritesContextValue = {
  isLoggedIn: boolean;
  isFavorite: (type: ItemType, id: number) => boolean;
  toggleFavorite: (type: ItemType, id: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ isLoggedIn, children }: { isLoggedIn: boolean; children: ReactNode }) {
  const [ids, setIds] = useState<Set<FavoriteKey>>(new Set());

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/subscriber/favorite-ids")
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          const rows = result.data as { item_type: ItemType; item_id: number }[];
          setIds(new Set(rows.map((row) => `${row.item_type}:${row.item_id}` as FavoriteKey)));
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  const isFavorite = useCallback((type: ItemType, id: number) => ids.has(`${type}:${id}`), [ids]);

  const toggleFavorite = useCallback(
    (type: ItemType, id: number) => {
      const key: FavoriteKey = `${type}:${id}`;
      const currentlyFavorite = ids.has(key);

      setIds((current) => {
        const next = new Set(current);
        if (currentlyFavorite) next.delete(key);
        else next.add(key);
        return next;
      });

      if (currentlyFavorite) {
        fetch(`/api/subscriber/favorites/${type}/${id}`, { method: "DELETE" }).catch(() => {});
      } else {
        fetch("/api/subscriber/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_type: type, item_id: id }),
        }).catch(() => {});
      }
    },
    [ids]
  );

  return (
    <FavoritesContext.Provider value={{ isLoggedIn, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
}
