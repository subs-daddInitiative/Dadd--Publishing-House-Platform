"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookPricingTier } from "@/lib/serverApi";
import styles from "./settings.module.css";

type BookPricingTiersFormProps = {
  initialTiers: BookPricingTier[];
};

export function BookPricingTiersForm({ initialTiers }: BookPricingTiersFormProps) {
  const router = useRouter();
  const [names, setNames] = useState<Record<number, string>>(
    Object.fromEntries(initialTiers.map((tier) => [tier.id, tier.name]))
  );
  const [prices, setPrices] = useState<Record<number, string>>(
    Object.fromEntries(initialTiers.map((tier) => [tier.id, tier.price]))
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSave() {
    setStatus("saving");
    const payload = initialTiers.map((tier) => ({
      id: tier.id,
      name: names[tier.id],
      price: Number(prices[tier.id]),
      currency: tier.currency,
    }));

    const response = await fetch("/api/admin/book-pricing-tiers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setStatus(result.success ? "saved" : "error");
    router.refresh();
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>باقات تسعير الكتب</h2>
      <p className={styles.hintText}>
        هذه الباقات (اقتصادي/احترافي/مميز) يمكن اختيارها بدلًا من سعر ثابت عند إضافة أو تعديل كتاب. تعديل السعر أو
        الاسم هنا يحدّث كل الكتب المرتبطة بهذه الباقة تلقائيًا.
      </p>
      {initialTiers.map((tier) => (
        <div className={styles.row} key={tier.id}>
          <div className={styles.field}>
            <label htmlFor={`tier-name-${tier.id}`} className={styles.label}>
              اسم الباقة ({tier.tier_key})
            </label>
            <input
              id={`tier-name-${tier.id}`}
              className={styles.input}
              value={names[tier.id] ?? ""}
              onChange={(event) => setNames((prev) => ({ ...prev, [tier.id]: event.target.value }))}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`tier-price-${tier.id}`} className={styles.label}>
              السعر ({tier.currency})
            </label>
            <input
              id={`tier-price-${tier.id}`}
              type="number"
              min={0}
              step="0.01"
              className={styles.input}
              value={prices[tier.id] ?? ""}
              onChange={(event) => setPrices((prev) => ({ ...prev, [tier.id]: event.target.value }))}
            />
          </div>
        </div>
      ))}
      <button type="button" className={styles.buttonSecondary} onClick={handleSave} disabled={status === "saving"}>
        حفظ باقات التسعير
      </button>
      {status === "saved" && <p>تم الحفظ بنجاح.</p>}
      {status === "error" && <p>حدث خطأ أثناء الحفظ.</p>}
    </div>
  );
}
