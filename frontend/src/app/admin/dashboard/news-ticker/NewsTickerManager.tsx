"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { NewsTickerItem, NewsTickerTarget } from "@/lib/serverApi";
import { TranslationsPanel } from "@/components/admin/TranslationsPanel";
import styles from "./news-ticker.module.css";

const TRANSLATION_FIELDS = [{ key: "message", label: "نص الرسالة", multiline: true }];

const TARGET_LABELS: Record<NewsTickerTarget, string> = {
  all: "الجميع",
  reader: "القرّاء فقط",
  writer: "الكُتّاب فقط",
};

type NewsTickerManagerProps = {
  initialItems: NewsTickerItem[];
};

export function NewsTickerManager({ initialItems }: NewsTickerManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<NewsTickerTarget>("all");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch("/api/admin/news-ticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, target, is_active: true, sort_order: items.length }),
    });
    const result = await response.json();

    if (result.success) {
      setItems((current) => [...current, result.data]);
      setMessage("");
      setTarget("all");
      router.refresh();
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشل إضافة الرسالة");
    }
    setStatus("idle");
  }

  async function handleToggleActive(item: NewsTickerItem) {
    setItems((current) =>
      current.map((row) => (row.id === item.id ? { ...row, is_active: item.is_active ? 0 : 1 } : row))
    );
    await fetch(`/api/admin/news-ticker/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: item.message,
        target: item.target,
        is_active: !item.is_active,
        sort_order: item.sort_order ?? 0,
      }),
    });
    router.refresh();
  }

  async function handleDelete(id: number) {
    setItems((current) => current.filter((row) => row.id !== id));
    await fetch(`/api/admin/news-ticker/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleCreate} className={styles.createForm}>
        <div className={styles.field}>
          <label htmlFor="tickerMessage" className={styles.label}>
            نص الرسالة
          </label>
          <input
            id="tickerMessage"
            className={styles.input}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={500}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="tickerTarget" className={styles.label}>
            تظهر لـ
          </label>
          <select
            id="tickerTarget"
            className={styles.select}
            value={target}
            onChange={(event) => setTarget(event.target.value as NewsTickerTarget)}
          >
            <option value="all">الجميع</option>
            <option value="reader">القرّاء فقط</option>
            <option value="writer">الكُتّاب فقط</option>
          </select>
        </div>
        <button type="submit" className={styles.button} disabled={status === "saving"}>
          {status === "saving" ? "جارٍ الإضافة..." : "إضافة رسالة"}
        </button>
        {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </form>

      {items.length === 0 ? (
        <p className={styles.empty}>لا توجد رسائل بعد.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemBody}>
                <p className={styles.itemMessage}>{item.message}</p>
                <p className={styles.itemMeta}>{TARGET_LABELS[item.target]}</p>
                {expandedId === item.id && (
                  <TranslationsPanel apiBase={`/api/admin/news-ticker/${item.id}`} fields={TRANSLATION_FIELDS} />
                )}
              </div>
              <div className={styles.itemActions}>
                <button type="button" className={styles.buttonSecondary} onClick={() => handleToggleActive(item)}>
                  {item.is_active ? "إيقاف" : "تفعيل"}
                </button>
                <button
                  type="button"
                  className={styles.buttonSecondary}
                  onClick={() => setExpandedId((current) => (current === item.id ? null : item.id))}
                >
                  {expandedId === item.id ? "إخفاء الترجمات" : "الترجمات"}
                </button>
                <button type="button" className={styles.buttonDanger} onClick={() => handleDelete(item.id)}>
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
