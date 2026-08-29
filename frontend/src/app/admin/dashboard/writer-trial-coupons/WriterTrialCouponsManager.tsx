"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { WriterTrialCoupon } from "@/lib/serverApi";
import styles from "./writer-trial-coupons.module.css";

type WriterTrialCouponsManagerProps = {
  initialCoupons: WriterTrialCoupon[];
};

export function WriterTrialCouponsManager({ initialCoupons }: WriterTrialCouponsManagerProps) {
  const router = useRouter();
  const [months, setMonths] = useState("1");
  const [maxRedemptions, setMaxRedemptions] = useState("1");
  const [customCode, setCustomCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreatedCode, setLastCreatedCode] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    setLastCreatedCode(null);

    const response = await fetch("/api/admin/writer-trial-coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        months: Number(months),
        max_redemptions: Number(maxRedemptions),
        code: customCode.trim() || undefined,
      }),
    });
    const result = await response.json();

    if (result.success) {
      setLastCreatedCode(result.data.code);
      setCustomCode("");
      router.refresh();
    } else {
      setError(result.message || "فشل إنشاء الكود");
    }
    setCreating(false);
  }

  return (
    <div>
      <form className={styles.createForm} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="couponMonths" className={styles.label}>
            عدد أشهر التجربة
          </label>
          <input
            id="couponMonths"
            type="number"
            min={1}
            className={styles.input}
            value={months}
            onChange={(event) => setMonths(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="couponMaxRedemptions" className={styles.label}>
            عدد مرات الاستخدام المسموحة
          </label>
          <input
            id="couponMaxRedemptions"
            type="number"
            min={1}
            className={styles.input}
            value={maxRedemptions}
            onChange={(event) => setMaxRedemptions(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="couponCustomCode" className={styles.label}>
            كود مخصص (اختياري - يُنشأ تلقائيًا إذا تُرك فارغًا)
          </label>
          <input
            id="couponCustomCode"
            className={styles.input}
            value={customCode}
            onChange={(event) => setCustomCode(event.target.value)}
            placeholder="مثال: WELCOME2026"
            maxLength={32}
          />
        </div>
        <button type="submit" className={styles.button} disabled={creating}>
          {creating ? "جارٍ الإنشاء..." : "إنشاء كود جديد"}
        </button>
        {lastCreatedCode && <p className={styles.successText}>تم إنشاء الكود: {lastCreatedCode}</p>}
        {error && <p className={styles.errorText}>{error}</p>}
      </form>

      {initialCoupons.length === 0 ? (
        <p className={styles.empty}>لا توجد أكواد بعد.</p>
      ) : (
        <ul className={styles.list}>
          {initialCoupons.map((coupon) => (
            <li key={coupon.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <p className={styles.itemCode}>{coupon.code}</p>
                <span
                  className={coupon.is_active ? styles.statusBadgeActive : styles.statusBadgeInactive}
                >
                  {coupon.is_active ? "فعّال" : "غير فعّال"}
                </span>
              </div>
              <p className={styles.itemMeta}>
                {coupon.months} {coupon.months === 1 ? "شهر" : "أشهر"} تجربة · استُخدم {coupon.redemptions_count} من{" "}
                {coupon.max_redemptions}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
