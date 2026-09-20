"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { WriterTrialSettings } from "@/lib/serverApi";
import styles from "./writer-trial.module.css";

type WriterTrialFormProps = {
  initialSettings: WriterTrialSettings;
};

export function WriterTrialForm({ initialSettings }: WriterTrialFormProps) {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(initialSettings.is_enabled);
  const [durationValue, setDurationValue] = useState(initialSettings.duration_value);
  const [durationUnit, setDurationUnit] = useState(initialSettings.duration_unit);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch("/api/admin/writer-trial-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_enabled: isEnabled,
        duration_value: durationValue,
        duration_unit: durationUnit,
      }),
    });
    const result = await response.json();

    if (result.success) {
      setStatus("saved");
      router.refresh();
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشل حفظ الإعدادات");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.createForm}>
      <div className={styles.field}>
        <label htmlFor="trialEnabled" className={styles.label}>
          <input
            id="trialEnabled"
            type="checkbox"
            checked={isEnabled}
            onChange={(event) => setIsEnabled(event.target.checked)}
          />{" "}
          تفعيل التجربة المجانية للكُتّاب الجدد
        </label>
      </div>
      <div className={styles.field}>
        <label htmlFor="trialDurationValue" className={styles.label}>
          المدة
        </label>
        <input
          id="trialDurationValue"
          type="number"
          min={1}
          max={365}
          className={styles.input}
          value={durationValue}
          onChange={(event) => setDurationValue(Number(event.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="trialDurationUnit" className={styles.label}>
          الوحدة
        </label>
        <select
          id="trialDurationUnit"
          className={styles.select}
          value={durationUnit}
          onChange={(event) => setDurationUnit(event.target.value as WriterTrialSettings["duration_unit"])}
        >
          <option value="day">يوم</option>
          <option value="week">أسبوع</option>
          <option value="month">شهر</option>
        </select>
      </div>
      <button type="submit" className={styles.button} disabled={status === "saving"}>
        {status === "saving" ? "جارٍ الحفظ..." : "حفظ"}
      </button>
      {status === "saved" && <p className={styles.itemMeta}>تم الحفظ بنجاح.</p>}
      {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
    </form>
  );
}
