"use client";

import { useEffect, useState } from "react";
import styles from "./TranslationsPanel.module.css";

type TranslationField = { key: string; label: string; multiline?: boolean };

type TranslationsPanelProps = {
  /** e.g. `/api/admin/about-features/12` — translations live at `${apiBase}/translations[/:locale]` */
  apiBase: string;
  fields: TranslationField[];
};

const LOCALES: { locale: "en" | "de"; name: string }[] = [
  { locale: "en", name: "English" },
  { locale: "de", name: "Deutsch" },
];

function emptyDraft(fields: TranslationField[]): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.key, ""]));
}

export function TranslationsPanel({ apiBase, fields }: TranslationsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({
    en: emptyDraft(fields),
    de: emptyDraft(fields),
  });
  const [existing, setExisting] = useState<Set<string>>(new Set());
  const [savingLocale, setSavingLocale] = useState<string | null>(null);
  const [errorByLocale, setErrorByLocale] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const response = await fetch(`${apiBase}/translations`);
      const result = await response.json();
      if (cancelled) return;
      if (result.success) {
        const nextDrafts: Record<string, Record<string, string>> = { en: emptyDraft(fields), de: emptyDraft(fields) };
        const nextExisting = new Set<string>();
        for (const row of result.data as Array<Record<string, unknown>>) {
          const locale = String(row.locale);
          nextDrafts[locale] = Object.fromEntries(
            fields.map((field) => [field.key, typeof row[field.key] === "string" ? (row[field.key] as string) : ""])
          );
          nextExisting.add(locale);
        }
        setDrafts(nextDrafts);
        setExisting(nextExisting);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  function updateDraft(locale: string, key: string, value: string) {
    setDrafts((current) => ({ ...current, [locale]: { ...(current[locale] || emptyDraft(fields)), [key]: value } }));
  }

  async function handleSave(locale: string) {
    setSavingLocale(locale);
    setErrorByLocale((current) => ({ ...current, [locale]: "" }));
    const draft = drafts[locale] || emptyDraft(fields);
    const response = await fetch(`${apiBase}/translations/${locale}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = await response.json();
    if (result.success) {
      setExisting((current) => new Set(current).add(locale));
    } else {
      setErrorByLocale((current) => ({ ...current, [locale]: result.message || "فشل حفظ الترجمة" }));
    }
    setSavingLocale(null);
  }

  async function handleDelete(locale: string) {
    setSavingLocale(locale);
    await fetch(`${apiBase}/translations/${locale}`, { method: "DELETE" });
    setExisting((current) => {
      const next = new Set(current);
      next.delete(locale);
      return next;
    });
    updateDraft(locale, fields[0]?.key ?? "", "");
    setDrafts((current) => ({ ...current, [locale]: emptyDraft(fields) }));
    setSavingLocale(null);
  }

  if (loading) {
    return <p className={styles.meta}>جارٍ تحميل الترجمات...</p>;
  }

  return (
    <div className={styles.panel}>
      {LOCALES.map(({ locale, name }) => {
        const draft = drafts[locale] || emptyDraft(fields);
        const isDone = existing.has(locale);
        return (
          <div key={locale} className={styles.block}>
            <div className={styles.blockHeader}>
              <span className={styles.blockTitle}>{name}</span>
              <span className={styles.meta}>{isDone ? "مُترجم" : "غير مُترجم"}</span>
            </div>

            {fields.map((field) =>
              field.multiline ? (
                <textarea
                  key={field.key}
                  className={styles.textarea}
                  placeholder={field.label}
                  value={draft[field.key] || ""}
                  onChange={(event) => updateDraft(locale, field.key, event.target.value)}
                />
              ) : (
                <input
                  key={field.key}
                  className={styles.input}
                  placeholder={field.label}
                  value={draft[field.key] || ""}
                  onChange={(event) => updateDraft(locale, field.key, event.target.value)}
                />
              )
            )}

            {errorByLocale[locale] && <p className={styles.error}>{errorByLocale[locale]}</p>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.buttonSecondary}
                disabled={savingLocale === locale}
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
