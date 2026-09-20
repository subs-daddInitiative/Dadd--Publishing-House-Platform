"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ContentTrial } from "@/lib/serverApi";
import styles from "./subscribers.module.css";

const UNIT_LABELS: Record<string, string> = { day: "يوم", week: "أسبوع", month: "شهر" };

type ContentTrialsSectionProps = {
  locale: Locale;
  isLoggedIn: boolean;
  trials: ContentTrial[];
  categoryNames: Record<string, string>;
};

export function ContentTrialsSection({ locale, isLoggedIn, trials, categoryNames }: ContentTrialsSectionProps) {
  const [redeemed, setRedeemed] = useState<Set<number>>(new Set());
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, string>>({});

  if (trials.length === 0) return null;

  async function handleRedeem(trialId: number) {
    setPendingId(trialId);
    setErrors((prev) => ({ ...prev, [trialId]: "" }));

    const response = await fetch("/api/content-trials/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trial_id: trialId }),
    });
    const result = await response.json();

    if (result.success) {
      setRedeemed((prev) => new Set(prev).add(trialId));
    } else if (response.status === 409) {
      setRedeemed((prev) => new Set(prev).add(trialId));
    } else {
      setErrors((prev) => ({ ...prev, [trialId]: result.message || "تعذّر تفعيل التجربة المجانية" }));
    }
    setPendingId(null);
  }

  return (
    <div className={styles.subscribePage}>
      <div className={styles.subscribeHeader}>
        <h2 className={styles.subscribeTitle}>تجارب مجانية</h2>
        <p className={styles.subscribeSubtitle}>جرّب المحتوى المميز مجانًا لفترة محدودة</p>
      </div>

      <div className={styles.subscribeCardsGrid}>
        {trials.map((trial) => {
          const categoryLabels = trial.categories
            .map((cat) => categoryNames[`${cat.category_type}:${cat.category_id}`])
            .filter(Boolean);
          const isRedeemed = redeemed.has(trial.id);

          return (
            <div key={trial.id} className={styles.subscribeCard}>
              <h3 className={styles.subscribeCardTitle}>{trial.name}</h3>
              <p className={styles.subscribeCardPrice}>
                {trial.duration_value} {UNIT_LABELS[trial.duration_unit] || trial.duration_unit}
              </p>
              {categoryLabels.length > 0 && (
                <ul className={styles.subscribeCardFeatures}>
                  {categoryLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              )}

              {isLoggedIn ? (
                <button
                  type="button"
                  className={styles.planButton}
                  disabled={isRedeemed || pendingId === trial.id}
                  onClick={() => handleRedeem(trial.id)}
                >
                  {isRedeemed ? "تم تفعيل التجربة" : pendingId === trial.id ? "جارٍ التفعيل..." : "ابدأ التجربة المجانية"}
                </button>
              ) : (
                <Link href={`/${locale}/login`} className={styles.planButton}>
                  سجّل الدخول للتفعيل
                </Link>
              )}
              {errors[trial.id] && <p className={styles.formStatusError}>{errors[trial.id]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
