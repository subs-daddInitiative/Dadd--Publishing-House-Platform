"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./ContentImportForm.module.css";

type ImportResultRow = {
  key: string;
  title: string;
  status: "created" | "error";
  id?: number;
  message?: string;
  warnings?: string[];
};

type FileResult = {
  filename: string;
  success: boolean;
  message?: string;
  results?: ImportResultRow[];
};

type ContentImportFormProps = {
  endpoint: string;
  editBasePath: string;
  itemLabel: string;
};

export function ContentImportForm({ endpoint, editBasePath, itemLabel }: ContentImportFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileResults, setFileResults] = useState<FileResult[] | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;

    setStatus("uploading");
    setErrorMessage(null);
    setFileResults(null);

    const formData = new FormData();
    for (const file of Array.from(files)) formData.append("files", file);

    const response = await fetch(endpoint, { method: "POST", body: formData });
    const result = await response.json();

    if (result.success) {
      setFileResults(result.data);
      setStatus("idle");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشل استيراد الملفات");
    }
  }

  const totalCreated =
    fileResults?.reduce((sum, file) => sum + (file.results?.filter((r) => r.status === "created").length ?? 0), 0) ??
    0;
  const totalFailedFiles = fileResults?.filter((file) => !file.success).length ?? 0;

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.field}>
        <label htmlFor="importFiles" className={styles.label}>
          ملف أو أكثر بصيغة Excel (.xlsx)
        </label>
        <input id="importFiles" ref={fileInputRef} type="file" accept=".xlsx" multiple required />
        <div className={styles.formActions}>
          <button type="submit" className={styles.button} disabled={status === "uploading"}>
            {status === "uploading" ? "جارٍ الاستيراد..." : "استيراد"}
          </button>
        </div>
        {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </form>

      {fileResults && (
        <div className={styles.summary}>
          <p className={totalCreated > 0 ? styles.statusOk : styles.itemMeta}>
            تم إنشاء {totalCreated} {itemLabel} بنجاح من {fileResults.length} ملف
            {totalFailedFiles > 0 && ` — وفشل ${totalFailedFiles} ملف بالكامل`}.
          </p>

          {fileResults.map((file, fileIndex) => (
            <div key={fileIndex} className={styles.fileBlock}>
              <p className={file.success ? styles.fileNameOk : styles.fileNameError}>
                {file.success ? "✓" : "✗"} {file.filename}
              </p>

              {!file.success && <p className={styles.statusError}>{file.message}</p>}

              {file.results && (
                <ul className={styles.list}>
                  {file.results.map((row) => (
                    <li key={row.key} className={styles.item}>
                      <p className={styles.itemTitle}>{row.title}</p>
                      {row.status === "created" ? (
                        <>
                          <p className={styles.statusOk}>
                            تم الإنشاء — <Link href={`${editBasePath}/${row.id}/edit`}>فتح للتعديل</Link>
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
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
