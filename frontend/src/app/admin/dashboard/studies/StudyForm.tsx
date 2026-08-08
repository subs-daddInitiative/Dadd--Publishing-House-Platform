"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { AdminStudyDetail, StudyCategory } from "@/lib/serverApi";
import styles from "./studies.module.css";

type StudyFormProps = {
  mode: "create" | "edit";
  studyId?: number;
  categories: StudyCategory[];
  initialStudy?: AdminStudyDetail;
  currentCoverImageUrl?: string | null;
  currentMainImageUrl?: string | null;
  currentPdfUrl?: string | null;
};

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function StudyForm({
  mode,
  studyId,
  categories,
  initialStudy,
  currentCoverImageUrl,
  currentMainImageUrl,
  currentPdfUrl,
}: StudyFormProps) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialStudy?.title || "");
  const [slug, setSlug] = useState(initialStudy?.slug || "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [author, setAuthor] = useState(initialStudy?.author || "");
  const [categoryId, setCategoryId] = useState(initialStudy?.category_id?.toString() || "");
  const [description, setDescription] = useState(initialStudy?.description || "");
  const [contentIntro, setContentIntro] = useState(initialStudy?.content_intro || "");
  const [contentBody, setContentBody] = useState(initialStudy?.content_body || "");
  const [status, setStatus] = useState(initialStudy?.status || "draft");
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("saving");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("author", author);
    formData.append("category_id", categoryId);
    formData.append("description", description);
    formData.append("content_intro", contentIntro);
    formData.append("content_body", contentBody);
    formData.append("status", status);

    const coverFile = coverInputRef.current?.files?.[0];
    if (coverFile) formData.append("cover_image", coverFile);
    const mainFile = mainImageInputRef.current?.files?.[0];
    if (mainFile) formData.append("main_image", mainFile);
    const pdfFile = pdfInputRef.current?.files?.[0];
    if (pdfFile) formData.append("pdf_file", pdfFile);

    const url = mode === "create" ? "/api/admin/studies" : `/api/admin/studies/${studyId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(url, { method, body: formData });
    const result = await response.json();

    if (result.success) {
      router.push("/admin/dashboard/studies");
      router.refresh();
    } else {
      setSubmitState("error");
      setErrorMessage(result.message || "فشل حفظ الدراسة");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="studyTitle" className={styles.label}>
          العنوان
        </label>
        <input
          id="studyTitle"
          className={styles.input}
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="studySlug" className={styles.label}>
          الرابط المختصر (slug)
        </label>
        <input
          id="studySlug"
          className={styles.input}
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          placeholder="يُنشأ تلقائيًا من العنوان"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="studyAuthor" className={styles.label}>
            اسم الباحث/الكاتب
          </label>
          <input
            id="studyAuthor"
            className={styles.input}
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="studyCategory" className={styles.label}>
            التصنيف
          </label>
          <select
            id="studyCategory"
            className={styles.select}
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">بدون تصنيف</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="studyStatus" className={styles.label}>
            الحالة
          </label>
          <select
            id="studyStatus"
            className={styles.select}
            value={status}
            onChange={(event) => setStatus(event.target.value as "draft" | "published")}
          >
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="studyDescription" className={styles.label}>
          مقتطف قصير (يظهر في القوائم)
        </label>
        <textarea
          id="studyDescription"
          className={styles.textarea}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={500}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>صورة الغلاف (تظهر في الخلفية العلوية)</label>
        {currentCoverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentCoverImageUrl} alt="" className={styles.imagePreview} />
        )}
        <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>الصورة الرئيسية</label>
        {currentMainImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentMainImageUrl} alt="" className={styles.imagePreview} />
        )}
        <input ref={mainImageInputRef} type="file" accept="image/png,image/jpeg,image/webp" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>الفقرة الأولى</label>
        <div className={styles.editorWrap}>
          <RichTextEditor value={contentIntro} onChange={setContentIntro} />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>الفقرة الثانية</label>
        <div className={styles.editorWrap}>
          <RichTextEditor value={contentBody} onChange={setContentBody} />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>ملف PDF (اختياري)</label>
        {currentPdfUrl && (
          <a href={currentPdfUrl} target="_blank" rel="noopener noreferrer" className={styles.currentFileLink}>
            عرض الملف الحالي
          </a>
        )}
        <input ref={pdfInputRef} type="file" accept="application/pdf" />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.button} disabled={submitState === "saving"}>
          {submitState === "saving" ? "جارٍ الحفظ..." : "حفظ"}
        </button>
        {submitState === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </div>
    </form>
  );
}
