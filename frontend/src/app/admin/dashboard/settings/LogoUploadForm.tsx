"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./settings.module.css";

type LogoUploadFormProps = {
  currentLogoUrl: string | null;
};

export function LogoUploadForm({ currentLogoUrl }: LogoUploadFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setStatus("saving");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("logo", file);

    const response = await fetch("/api/admin/settings/logo", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (result.success) {
      setStatus("saved");
      router.refresh();
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشل رفع الشعار");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.section}>
      <h2 className={styles.sectionTitle}>شعار الموقع (الهيدر والفوتر)</h2>

      {currentLogoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentLogoUrl} alt="الشعار الحالي" className={styles.logoPreview} />
      )}

      <div className={styles.field}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
        />
      </div>

      <button type="submit" className={styles.button} disabled={status === "saving"}>
        {status === "saving" ? "جارٍ الرفع..." : "رفع الشعار"}
      </button>
      {status === "saved" && <p className={styles.statusOk}>تم تحديث الشعار</p>}
      {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
    </form>
  );
}
