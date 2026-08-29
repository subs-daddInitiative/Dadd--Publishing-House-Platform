"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./subscribers.module.css";

export function CouponRedeemForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);

    const response = await fetch("/api/subscriber/writer-trial/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const result = await response.json();

    if (result.success) {
      router.refresh();
    } else {
      setStatus("error");
      setMessage(result.message || "فشل تفعيل الكود");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.couponForm}>
      <label htmlFor="trialCouponCode" className={styles.label}>
        لديك كود تجربة مجانية؟
      </label>
      <div className={styles.couponRow}>
        <input
          id="trialCouponCode"
          className={styles.input}
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="أدخل الكود"
          required
        />
        <button type="submit" className={styles.planButton} disabled={status === "sending"}>
          تفعيل
        </button>
      </div>
      {message && <p className={styles.formStatusError}>{message}</p>}
    </form>
  );
}
