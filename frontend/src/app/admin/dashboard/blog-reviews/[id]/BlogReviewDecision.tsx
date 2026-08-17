"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../writer-requests/writer-requests.module.css";

type BlogReviewDecisionProps = {
  blogId: number;
};

export function BlogReviewDecision({ blogId }: BlogReviewDecisionProps) {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function decide(decision: "approved" | "rejected") {
    if (decision === "rejected" && !reason.trim()) {
      setError("يجب كتابة سبب الرفض");
      return;
    }
    setPending(true);
    setError("");

    const response = await fetch(`/api/admin/blogs/${blogId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, is_premium: isPremium, reason }),
    });
    const result = await response.json();

    if (result.success) {
      router.push("/admin/dashboard/blog-reviews");
      router.refresh();
    } else {
      setError(result.message || "حدث خطأ");
    }
    setPending(false);
  }

  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <p className={styles.itemName}>قرار المراجعة</p>
      </div>

      <label>
        <input type="radio" name="premium" checked={!isPremium} onChange={() => setIsPremium(false)} /> مقالة مجانية
      </label>
      <br />
      <label>
        <input type="radio" name="premium" checked={isPremium} onChange={() => setIsPremium(true)} /> مقالة مميزة (تتطلب اشتراك المدونة)
      </label>

      <textarea
        className={styles.textarea}
        placeholder="سبب الرفض (مطلوب فقط عند الرفض)"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />

      <div className={styles.actions}>
        <button type="button" className={styles.buttonAccept} disabled={pending} onClick={() => decide("approved")}>
          قبول ونشر
        </button>
        <button type="button" className={styles.buttonReject} disabled={pending} onClick={() => decide("rejected")}>
          رفض
        </button>
      </div>

      {error && <p>{error}</p>}
    </div>
  );
}
