"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import styles from "./NewsletterPopup.module.css";

type NewsletterPopupProps = {
  locale: Locale;
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
  consentPrefix: string;
  consentAnd: string;
  consentRequired: string;
  privacyLabel: string;
  termsLabel: string;
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
  locale,
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
  consentPrefix,
  consentAnd,
  consentRequired,
  privacyLabel,
  termsLabel,
}: NewsletterPopupProps) {
  const key = categorySlug || `blog:${blogSlug}`;
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

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

    if (!consentChecked) {
      setError(consentRequired);
      return;
    }
    setError("");
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

          <label className={styles.consentRow}>
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(event) => {
                setConsentChecked(event.target.checked);
                if (event.target.checked) setError("");
              }}
            />
            <span>
              {consentPrefix}{" "}
              <Link href={`/${locale}/privacy`} target="_blank" className={styles.consentLink}>
                {privacyLabel}
              </Link>{" "}
              {consentAnd}{" "}
              <Link href={`/${locale}/terms`} target="_blank" className={styles.consentLink}>
                {termsLabel}
              </Link>
            </span>
          </label>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={status === "sending" || !consentChecked}>
            {subscribeLabel}
          </button>
        </form>
      )}
    </div>
  );
}
