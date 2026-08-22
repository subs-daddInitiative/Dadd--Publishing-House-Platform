"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SubscriptionPlan } from "@/lib/serverApi";
import { currencySymbol } from "@/lib/currency";
import styles from "./settings.module.css";

const TIER_LABELS: Record<string, string> = {
  beginner: "كاتب مبتدئ",
  verified: "كاتب موثق",
};

const CYCLE_LABELS: Record<string, string> = {
  monthly: "شهري",
  annual: "سنوي",
};

type SubscriptionPlansFormProps = {
  initialPlans: SubscriptionPlan[];
};

export function SubscriptionPlansForm({ initialPlans }: SubscriptionPlansFormProps) {
  const router = useRouter();
  const [prices, setPrices] = useState<Record<number, string>>(
    Object.fromEntries(initialPlans.map((plan) => [plan.id, plan.price]))
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSave() {
    setStatus("saving");
    const payload = initialPlans.map((plan) => ({
      tier: plan.tier,
      billing_cycle: plan.billing_cycle,
      price: Number(prices[plan.id]),
    }));

    const response = await fetch("/api/admin/subscription-plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plans: payload }),
    });
    const result = await response.json();
    setStatus(result.success ? "saved" : "error");
    router.refresh();
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>خطط اشتراك الكُتّاب</h2>
      {initialPlans.map((plan) => (
        <div className={styles.row} key={plan.id}>
          <div className={styles.field}>
            <label htmlFor={`plan-${plan.id}`} className={styles.label}>
              {TIER_LABELS[plan.tier]} - {CYCLE_LABELS[plan.billing_cycle]} ({currencySymbol(plan.currency)})
            </label>
            <input
              id={`plan-${plan.id}`}
              type="number"
              min={0}
              step="0.01"
              className={styles.input}
              value={prices[plan.id] ?? ""}
              onChange={(event) =>
                setPrices((prev) => ({ ...prev, [plan.id]: event.target.value }))
              }
            />
          </div>
        </div>
      ))}
      <button type="button" className={styles.buttonSecondary} onClick={handleSave} disabled={status === "saving"}>
        حفظ الأسعار
      </button>
      {status === "saved" && <p>تم الحفظ بنجاح.</p>}
      {status === "error" && <p>حدث خطأ أثناء الحفظ.</p>}
    </div>
  );
}
