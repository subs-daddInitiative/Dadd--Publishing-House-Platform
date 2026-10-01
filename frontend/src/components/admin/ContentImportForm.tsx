"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./ContentImportForm.module.css";

type ImportResultRow = {
  key: string;
  title: string;
  rowId: string;
  status: "created" | "updated" | "duplicate" | "error";
  id?: number;
  existingId?: number;
  existingTitle?: string;
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedDuplicates, setSelectedDuplicates] = useState<Set<string>>(new Set());

  async function runImport(files: File[], overwriteIds: string[] | null) {
    setStatus("uploading");
    setErrorMessage(null);

    const formData = new FormData();
    for (const file of files) formData.append("files", file);
    if (overwriteIds) {
      formData.append("duplicates", "overwrite");
      formData.append("only", JSON.stringify(overwriteIds));
    }

    try {
      const response = await fetch(endpoint, { method: "POST", body: formData });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      const incoming: FileResult[] = result.data;
      // An overwrite pass only returns the chosen rows, so fold them into the earlier report.
      setFileResults((previous) =>
        overwriteIds && previous
          ? previous.map((file, index) => {
              const redone = new Map((incoming[index]?.results ?? []).map((row) => [row.rowId, row]));
              return {
                ...file,
                results: file.results?.map((row) => redone.get(row.rowId) ?? row),
              };
            })
          : incoming
      );
      setUploadedFiles(files);
      setSelectedDuplicates(new Set());
      setStatus("idle");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error && error.message ? error.message : "فشل استيراد الملفات");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;
    setFileResults(null);
    void runImport(Array.from(files), null);
  }

  function toggleDuplicate(rowId: string) {
    setSelectedDuplicates((previous) => {
      const next = new Set(previous);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }

  const duplicateIds =
    fileResults?.flatMap((file) => file.results?.filter((row) => row.status === "duplicate").map((row) => row.rowId) ?? []) ?? [];

  const countByStatus = (wanted: ImportResultRow["status"]) =>
    fileResults?.reduce((sum, file) => sum + (file.results?.filter((r) => r.status === wanted).length ?? 0), 0) ?? 0;
  const totalCreated = countByStatus("created");
  const totalUpdated = countByStatus("updated");
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
          <p className={totalCreated + totalUpdated > 0 ? styles.statusOk : styles.itemMeta}>
            تم إنشاء {totalCreated} {itemLabel}{totalUpdated > 0 && ` وتحديث ${totalUpdated}`} من {fileResults.length} ملف
            {totalFailedFiles > 0 && ` — وفشل ${totalFailedFiles} ملف بالكامل`}.
          </p>

          {duplicateIds.length > 0 && (
            <div className={styles.fileBlock}>
              <p className={styles.statusError}>
                يوجد {duplicateIds.length} {itemLabel} مطابق لمحتوى موجود بالفعل ولم يُضف. حدد ما تريد استبداله بالنسخة الجديدة من الملف (سيُحدَّث المحتوى مع الإبقاء على الرابط والترجمات).
              </p>
              <div className={styles.formActions}>
                <button type="button" className={styles.button} onClick={() => setSelectedDuplicates(new Set(duplicateIds))}>
                  تحديد الكل
                </button>
                <button
                  type="button"
                  className={styles.button}
                  disabled={selectedDuplicates.size === 0 || status === "uploading"}
                  onClick={() => void runImport(uploadedFiles, Array.from(selectedDuplicates))}
                >
                  {status === "uploading" ? "جارٍ الاستبدال..." : `استبدال المحدد (${selectedDuplicates.size})`}
                </button>
              </div>
            </div>
          )}

          {fileResults.map((file, fileIndex) => (
            <div key={fileIndex} className={styles.fileBlock}>
              <p className={file.success ? styles.fileNameOk : styles.fileNameError}>
                {file.success ? "✓" : "✗"} {file.filename}
              </p>

              {!file.success && <p className={styles.statusError}>{file.message}</p>}

              {file.results && (
                <ul className={styles.list}>
                  {file.results.map((row) => (
                    <li key={row.rowId} className={styles.item}>
                      <p className={styles.itemTitle}>{row.title}</p>
                      {row.status === "duplicate" ? (
                        <label className={styles.itemMeta}>
                          <input
                            type="checkbox"
                            checked={selectedDuplicates.has(row.rowId)}
                            onChange={() => toggleDuplicate(row.rowId)}
                          />{" "}
                          موجود مسبقاً باسم «{row.existingTitle}» — استبداله بهذه النسخة
                        </label>
                      ) : row.status === "created" || row.status === "updated" ? (
                        <>
                          <p className={styles.statusOk}>
                            {row.status === "updated" ? "تم التحديث" : "تم الإنشاء"} — <Link href={`${editBasePath}/${row.id}/edit`}>فتح للتعديل</Link>
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
