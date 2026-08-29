"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./NewsletterPopup.module.css";

type NewsletterPopupProps = {
  categoryName: string | null;
  categorySlug: string | null;
  blogSlug: string;
  title: string;
  descriptionWithCategory: string;
  descriptionGeneric: string;
  emailPlaceholder: string;
  subscribeLabel: string;
  dismissLabel: string;
  successMessage: string;
};

const STORAGE_KEY = "newsletter:handled";
const SHOW_DELAY_MS = 8000;

function getHandledSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markHandled(key: string) {
  const set = getHandledSet();
  set.add(key);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // ignore storage failures (private browsing, etc.)
  }
}

export function NewsletterPopup({
  categoryName,
  categorySlug,
  blogSlug,
  title,
  descriptionWithCategory,
  descriptionGeneric,
  emailPlaceholder,
  subscribeLabel,
  dismissLabel,
  successMessage,
}: NewsletterPopupProps) {
  const key = categorySlug || `blog:${blogSlug}`;
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    if (getHandledSet().has(key)) return;
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [key]);

  function dismiss() {
    markHandled(key);
    setVisible(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");

    try {
      await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          category_slug: categorySlug,
          category_name: categoryName,
          blog_slug: blogSlug,
        }),
      });
    } catch {
      // best-effort: still mark as handled so the popup doesn't nag on failure
    }

    markHandled(key);
    setStatus("done");
  }

  if (!visible) return null;

  return (
    <div className={styles.card} role="dialog" aria-modal="false">
      <button type="button" className={styles.closeButton} onClick={dismiss} aria-label={dismissLabel}>
        ×
      </button>

      {status === "done" ? (
        <p className={styles.successText}>{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>
            {categoryName ? descriptionWithCategory.replace("{category}", categoryName) : descriptionGeneric}
          </p>
          <input
            type="email"
            required
            className={styles.input}
            placeholder={emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" className={styles.submitButton} disabled={status === "sending"}>
            {subscribeLabel}
          </button>
        </form>
      )}
    </div>
  );
}
