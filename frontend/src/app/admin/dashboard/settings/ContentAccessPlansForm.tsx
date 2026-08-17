"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContentAccessPlan } from "@/lib/serverApi";
import styles from "./settings.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  blogs: "المدونة المميزة",
  studies: "الدراسات المميزة (اشتراك شامل)",
};

const CYCLE_LABELS: Record<string, string> = {
  monthly: "شهري",
  annual: "سنوي",
};

type ContentAccessPlansFormProps = {
  initialPlans: ContentAccessPlan[];
};

export function ContentAccessPlansForm({ initialPlans }: ContentAccessPlansFormProps) {
  const router = useRouter();
  const [prices, setPrices] = useState<Record<number, string>>(
    Object.fromEntries(initialPlans.map((plan) => [plan.id, plan.price]))
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSave() {
    setStatus("saving");
    const payload = initialPlans.map((plan) => ({
      category: plan.category,
      billing_cycle: plan.billing_cycle,
      price: Number(prices[plan.id]),
    }));

    const response = await fetch("/api/admin/content-access-plans", {
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
      <h2 className={styles.sectionTitle}>أسعار الوصول المميز للمدونة والدراسات</h2>
      {initialPlans.map((plan) => (
        <div className={styles.row} key={plan.id}>
          <div className={styles.field}>
            <label htmlFor={`content-plan-${plan.id}`} className={styles.label}>
              {CATEGORY_LABELS[plan.category]} - {CYCLE_LABELS[plan.billing_cycle]} ({plan.currency})
            </label>
            <input
              id={`content-plan-${plan.id}`}
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
