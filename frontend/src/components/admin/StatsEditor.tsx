"use client";

import styles from "./StatsEditor.module.css";

export type Stat = { number: string; title: string };

export const MAX_STATS = 6;

type StatsEditorProps = {
  stats: Stat[];
  onChange: (stats: Stat[]) => void;
};

export function parseInitialStats(raw: string | null | undefined): Stat[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .slice(0, MAX_STATS)
      .map((item) => ({ number: String(item?.number ?? ""), title: String(item?.title ?? "") }));
  } catch {
    return [];
  }
}

export function StatsEditor({ stats, onChange }: StatsEditorProps) {
  function updateStat(index: number, field: keyof Stat, value: string) {
    onChange(stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)));
  }

  function removeStat(index: number) {
    onChange(stats.filter((_, i) => i !== index));
  }

  function addStat() {
    if (stats.length >= MAX_STATS) return;
    onChange([...stats, { number: "", title: "" }]);
  }

  return (
    <div>
      {stats.map((stat, index) => (
        <div key={index} className={styles.row}>
          <input
            className={styles.input}
            placeholder="الرقم (مثال: 500)"
            value={stat.number}
            onChange={(event) => updateStat(index, "number", event.target.value)}
            maxLength={20}
          />
          <input
            className={styles.input}
            placeholder="العنوان (مثال: مشارك)"
            value={stat.title}
            onChange={(event) => updateStat(index, "title", event.target.value)}
            maxLength={60}
          />
          <button type="button" className={styles.buttonDanger} onClick={() => removeStat(index)}>
            حذف
          </button>
        </div>
      ))}
      {stats.length < MAX_STATS && (
        <button type="button" className={styles.addButton} onClick={addStat}>
          إضافة رقم ({stats.length}/{MAX_STATS})
        </button>
      )}
    </div>
  );
}
