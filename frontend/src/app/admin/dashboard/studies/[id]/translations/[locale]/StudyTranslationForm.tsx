"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BlockEditor, type ContentBlock } from "@/features/blogEditor/BlockEditor";
import type { AdminStudyTranslation } from "@/lib/serverApi";
import styles from "../../../studies.module.css";

type StudyTranslationFormProps = {
  studyId: number;
  locale: string;
  initialTranslation: AdminStudyTranslation | null;
};

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function parseInitialBlocks(raw: string | null | undefined): ContentBlock[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function StudyTranslationForm({ studyId, locale, initialTranslation }: StudyTranslationFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTranslation?.title || "");
  const [slug, setSlug] = useState(initialTranslation?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialTranslation));
  const [description, setDescription] = useState(initialTranslation?.description || "");
  const [blocks, setBlocks] = useState<ContentBlock[]>(parseInitialBlocks(initialTranslation?.content_blocks));
  const [uploading, setUploading] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("saving");
    setErrorMessage(null);

    const response = await fetch(`/api/admin/studies/${studyId}/translations/${locale}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        description,
        content_blocks: JSON.stringify(blocks),
      }),
    });
    const result = await response.json();

    if (result.success) {
      router.push(`/admin/dashboard/studies/${studyId}/edit`);
      router.refresh();
    } else {
      setSubmitState("error");
      setErrorMessage(result.message || "فشل حفظ الترجمة");
    }
  }

  async function handleDelete() {
    if (!window.confirm("هل تريد حذف هذه الترجمة؟ لن تظهر الدراسة بعدها لزوار هذه اللغة.")) return;
    await fetch(`/api/admin/studies/${studyId}/translations/${locale}`, { method: "DELETE" });
    router.push(`/admin/dashboard/studies/${studyId}/edit`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="translationTitle" className={styles.label}>
          العنوان
        </label>
        <input
          id="translationTitle"
          className={styles.input}
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="translationSlug" className={styles.label}>
          الرابط المختصر (slug)
        </label>
        <input
          id="translationSlug"
          className={styles.input}
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          placeholder="يُنشأ تلقائيًا من العنوان"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="translationDescription" className={styles.label}>
          مقتطف قصير (يظهر في القوائم)
        </label>
        <textarea
          id="translationDescription"
          className={styles.textarea}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={500}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>محتوى الدراسة (أقسام)</label>
        <BlockEditor
          blocks={blocks}
          onChange={setBlocks}
          onUploadingChange={setUploading}
          uploadUrl="/api/admin/studies/upload-asset"
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.button} disabled={submitState === "saving" || uploading}>
          {uploading ? "جارٍ رفع الملفات..." : submitState === "saving" ? "جارٍ الحفظ..." : "حفظ الترجمة"}
        </button>
        {initialTranslation && (
          <button type="button" className={styles.buttonDanger} onClick={handleDelete}>
            حذف الترجمة
          </button>
        )}
        {submitState === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </div>
    </form>
  );
}
