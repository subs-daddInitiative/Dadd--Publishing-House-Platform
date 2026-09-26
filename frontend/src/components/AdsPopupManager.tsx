"use client";

import { useEffect, useState } from "react";
import type { SiteAd } from "@/lib/serverApi";
import styles from "./AdsPopupManager.module.css";

type AdsPopupManagerProps = {
  ads: SiteAd[];
  closeLabel: string;
  closeAllLabel: string;
};

const STORAGE_KEY = "site_ads:dismissed";
const SHOW_DELAY_MS = 2500;

function getDismissedSet(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

function markDismissed(id: number) {
  const set = getDismissedSet();
  set.add(id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // ignore storage failures (private browsing, etc.)
  }
}

function markAllDismissed(ids: number[]) {
  const set = getDismissedSet();
  for (const id of ids) set.add(id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // ignore storage failures (private browsing, etc.)
  }
}

export function AdsPopupManager({ ads, closeLabel, closeAllLabel }: AdsPopupManagerProps) {
  const [queue, setQueue] = useState<SiteAd[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = getDismissedSet();
    const pending = ads.filter((ad) => !dismissed.has(ad.id));
    if (pending.length === 0) return;

    setQueue(pending);
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ads]);

  function handleClose() {
    const current = queue[0];
    if (current) markDismissed(current.id);

    setVisible(false);
    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
    }, 200);
  }

  function handleCloseAll() {
    markAllDismissed(queue.map((ad) => ad.id));

    setVisible(false);
    setTimeout(() => {
      setQueue([]);
    }, 200);
  }

  useEffect(() => {
    if (queue.length > 0 && !visible) {
      const timer = setTimeout(() => setVisible(true), 350);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [queue, visible]);

  const current = queue[0];
  if (!current || !visible) return null;

  return (
    <div className={styles.corner}>
      <div
        className={`${styles.card} ${current.image ? styles.hasImage : ""}`}
        role="complementary"
        aria-label={current.title}
      >
        {current.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.image} alt="" className={styles.image} />
        )}
        <div className={styles.scrim} />

        <button type="button" className={styles.closeButton} onClick={handleClose} aria-label={closeLabel}>
          ×
        </button>

        <div className={styles.body}>
          <h2 className={styles.title}>{current.title}</h2>
          {current.message && <p className={styles.message}>{current.message}</p>}

          <div className={styles.actions}>
            {current.link_url && (
              <a
                href={current.link_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={styles.ctaButton}
                onClick={() => current && markDismissed(current.id)}
              >
                {current.link_label || "المزيد"}
              </a>
            )}
            <button type="button" className={styles.dismissButton} onClick={handleClose}>
              {closeLabel}
            </button>
            {queue.length > 1 && (
              <button type="button" className={styles.dismissButton} onClick={handleCloseAll}>
                {closeAllLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

