"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "../studies.module.css";

type ImportResultRow = {
  key: string;
  title: string;
  status: "created" | "error";
  id?: number;
  message?: string;
  warnings?: string[];
};

export function StudiesImportForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<ImportResultRow[] | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setErrorMessage(null);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/studies/import", { method: "POST", body: formData });
    const result = await response.json();

    if (result.success) {
      setResults(result.data);
      setStatus("idle");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشل استيراد الملف");
    }
  }

  const createdCount = results?.filter((r) => r.status === "created").length ?? 0;
  const errorCount = results?.filter((r) => r.status === "error").length ?? 0;

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.field}>
        <label htmlFor="importFile" className={styles.label}>
          ملف Excel (.xlsx)
        </label>
        <input id="importFile" ref={fileInputRef} type="file" accept=".xlsx" required />
        <div className={styles.formActions} style={{ marginTop: "0.75rem" }}>
          <button type="submit" className={styles.button} disabled={status === "uploading"}>
            {status === "uploading" ? "جارٍ الاستيراد..." : "استيراد"}
          </button>
        </div>
        {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </form>

      {results && (
        <div style={{ marginTop: "1.5rem" }}>
          <p className={createdCount > 0 ? styles.statusOk : styles.itemMeta}>
            تم إنشاء {createdCount} دراسة بنجاح
            {errorCount > 0 && ` — وفشل ${errorCount}`}.
          </p>
          <ul className={styles.list}>
            {results.map((row) => (
              <li key={row.key} className={styles.item}>
                <div className={styles.itemBody}>
                  <p className={styles.itemTitle}>{row.title}</p>
                  {row.status === "created" ? (
                    <>
                      <p className={styles.statusOk}>
                        تم الإنشاء —{" "}
                        <Link href={`/admin/dashboard/studies/${row.id}/edit`}>فتح للتعديل</Link>
                      </p>
                      {row.warnings?.map((warning, index) => (
                        <p key={index} className={styles.itemMeta}>
                          تنبيه: {warning}
                        </p>
                      ))}
                    </>
                  ) : (
                    <p className={styles.statusError}>فشل: {row.message}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
