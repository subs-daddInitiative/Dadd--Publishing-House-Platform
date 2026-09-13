"use client";

import { useEffect, useState } from "react";
import type { SiteAdTranslation } from "@/lib/serverApi";
import styles from "./site-ads.module.css";

type SiteAdTranslationsPanelProps = {
  adId: number;
};

const LOCALES: { locale: "en" | "de"; name: string }[] = [
  { locale: "en", name: "English" },
  { locale: "de", name: "Deutsch" },
];

type Draft = { title: string; message: string; link_label: string };

function emptyDraft(): Draft {
  return { title: "", message: "", link_label: "" };
}

export function SiteAdTranslationsPanel({ adId }: SiteAdTranslationsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({ en: emptyDraft(), de: emptyDraft() });
  const [existing, setExisting] = useState<Set<string>>(new Set());
  const [savingLocale, setSavingLocale] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const response = await fetch(`/api/admin/site-ads/${adId}/translations`);
      const result = await response.json();
      if (cancelled) return;
      if (result.success) {
        const translations = result.data as SiteAdTranslation[];
        const nextDrafts: Record<string, Draft> = { en: emptyDraft(), de: emptyDraft() };
        const nextExisting = new Set<string>();
        for (const translation of translations) {
          nextDrafts[translation.locale] = {
            title: translation.title,
            message: translation.message || "",
            link_label: translation.link_label || "",
          };
          nextExisting.add(translation.locale);
        }
        setDrafts(nextDrafts);
        setExisting(nextExisting);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [adId]);

  function updateDraft(locale: string, patch: Partial<Draft>) {
    setDrafts((current) => {
      const next: Record<string, Draft> = { ...current };
      next[locale] = { ...(current[locale] || emptyDraft()), ...patch };
      return next;
    });
  }

  async function handleSave(locale: string) {
    setSavingLocale(locale);
    const draft = drafts[locale] || emptyDraft();
    const response = await fetch(`/api/admin/site-ads/${adId}/translations/${locale}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = await response.json();
    if (result.success) {
      setExisting((current) => new Set(current).add(locale));
    }
    setSavingLocale(null);
  }

  async function handleDelete(locale: string) {
    setSavingLocale(locale);
    await fetch(`/api/admin/site-ads/${adId}/translations/${locale}`, { method: "DELETE" });
    setExisting((current) => {
      const next = new Set(current);
      next.delete(locale);
      return next;
    });
    updateDraft(locale, emptyDraft());
    setSavingLocale(null);
  }

  if (loading) {
    return <p className={styles.itemMeta}>جارٍ تحميل الترجمات...</p>;
  }

  return (
    <div className={styles.translationsPanel}>
      {LOCALES.map(({ locale, name }) => {
        const draft = drafts[locale] || emptyDraft();
        const isDone = existing.has(locale);
        return (
          <div key={locale} className={styles.translationBlock}>
            <div className={styles.translationBlockHeader}>
              <span className={styles.translationBlockTitle}>{name}</span>
              <span className={styles.itemMeta}>{isDone ? "مُترجم" : "غير مُترجم — لن يظهر لزوار هذه اللغة"}</span>
            </div>

            <div className={styles.field}>
              <input
                className={styles.input}
                placeholder="العنوان"
                value={draft.title}
                onChange={(event) => updateDraft(locale, { title: event.target.value })}
              />
            </div>
            <div className={styles.field}>
              <textarea
                className={styles.textarea}
                placeholder="النص (اختياري)"
                value={draft.message}
                onChange={(event) => updateDraft(locale, { message: event.target.value })}
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                placeholder="نص الزر (اختياري)"
                value={draft.link_label}
                onChange={(event) => updateDraft(locale, { link_label: event.target.value })}
              />
            </div>

            <div className={styles.itemActions}>
              <button
                type="button"
                className={styles.buttonSecondary}
                disabled={savingLocale === locale || !draft.title.trim()}
                onClick={() => handleSave(locale)}
              >
                {savingLocale === locale ? "جارٍ الحفظ..." : "حفظ الترجمة"}
              </button>
              {isDone && (
                <button type="button" className={styles.buttonDanger} onClick={() => handleDelete(locale)}>
                  حذف الترجمة
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
