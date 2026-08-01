"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./settings.module.css";

type GeneralSettingsFormProps = {
  initialSiteName: string;
  initialCallNumber: string;
  initialWhatsappNumber: string;
  initialAboutText: string;
};

export function GeneralSettingsForm({
  initialSiteName,
  initialCallNumber,
  initialWhatsappNumber,
  initialAboutText,
}: GeneralSettingsFormProps) {
  const router = useRouter();
  const [siteName, setSiteName] = useState(initialSiteName);
  const [callNumber, setCallNumber] = useState(initialCallNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsappNumber);
  const [aboutText, setAboutText] = useState(initialAboutText);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site_name: siteName,
        call_number: callNumber,
        whatsapp_number: whatsappNumber,
        about_text: aboutText,
      }),
    });
    const result = await response.json();

    if (result.success) {
      setStatus("saved");
      router.refresh();
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.section}>
      <h2 className={styles.sectionTitle}>الإعدادات العامة</h2>

      <div className={styles.field}>
        <label htmlFor="siteName" className={styles.label}>اسم الموقع</label>
        <input
          id="siteName"
          className={styles.input}
          value={siteName}
          onChange={(event) => setSiteName(event.target.value)}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="callNumber" className={styles.label}>رقم الاتصال</label>
          <input
            id="callNumber"
            className={styles.input}
            value={callNumber}
            onChange={(event) => setCallNumber(event.target.value)}
            placeholder="+970 5X XXX XXXX"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="whatsappNumber" className={styles.label}>رقم واتساب</label>
          <input
            id="whatsappNumber"
            className={styles.input}
            value={whatsappNumber}
            onChange={(event) => setWhatsappNumber(event.target.value)}
            placeholder="+970 5X XXX XXXX"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="aboutText" className={styles.label}>نص قسم &quot;من نحن&quot;</label>
        <textarea
          id="aboutText"
          className={styles.textarea}
          value={aboutText}
          onChange={(event) => setAboutText(event.target.value)}
        />
      </div>

      <button type="submit" className={styles.button} disabled={status === "saving"}>
        {status === "saving" ? "جارٍ الحفظ..." : "حفظ"}
      </button>
      {status === "saved" && <p className={styles.statusOk}>تم الحفظ بنجاح</p>}
      {status === "error" && <p className={styles.statusError}>حدث خطأ أثناء الحفظ</p>}
    </form>
  );
}
