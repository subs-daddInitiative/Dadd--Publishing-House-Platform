"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BlockEditor, type ContentBlock } from "@/features/blogEditor/BlockEditor";
import { ImageCropper } from "@/components/ImageCropper";
import type { AdminStudyDetail, StudyCategory } from "@/lib/serverApi";
import styles from "./studies.module.css";

const COVER_ASPECT_RATIO = 16 / 6;
const COVER_ASPECT_LABEL = "16:6 (عريضة وقصيرة، مثال: 1600×600 بكسل)";

type StudyFormProps = {
  mode: "create" | "edit";
  studyId?: number;
  categories: StudyCategory[];
  initialStudy?: AdminStudyDetail;
  currentCoverImageUrl?: string | null;
  currentPdfUrl?: string | null;
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

// Converts a "YYYY-MM-DD HH:MM:SS" (MySQL) or ISO value into the
// "YYYY-MM-DDTHH:MM" shape a <input type="datetime-local"> expects.
function toDatetimeLocalValue(raw: string | null | undefined): string {
  if (!raw) return "";
  const date = new Date(raw.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function StudyForm({
  mode,
  studyId,
  categories,
  initialStudy,
  currentCoverImageUrl,
  currentPdfUrl,
}: StudyFormProps) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);

  const [title, setTitle] = useState(initialStudy?.title || "");
  const [slug, setSlug] = useState(initialStudy?.slug || "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [author, setAuthor] = useState(initialStudy?.author || "");
  const [categoryId, setCategoryId] = useState(initialStudy?.category_id?.toString() || "");
  const [description, setDescription] = useState(initialStudy?.description || "");
  const [blocks, setBlocks] = useState<ContentBlock[]>(parseInitialBlocks(initialStudy?.content_blocks));
  const [status, setStatus] = useState(initialStudy?.status || "draft");
  const [isPremium, setIsPremium] = useState(Boolean(initialStudy?.is_premium));
  const [isHighlighted, setIsHighlighted] = useState(Boolean(initialStudy?.is_highlighted));
  const [highlightedUntil, setHighlightedUntil] = useState(toDatetimeLocalValue(initialStudy?.highlighted_until));
  const [price, setPrice] = useState(initialStudy?.price || "");
  const [uploading, setUploading] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleCoverFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setCropFile(file);
    event.target.value = "";
  }

  function handleCropConfirm(blob: Blob) {
    setCoverFile(new File([blob], "cover.jpg", { type: "image/jpeg" }));
    setCropFile(null);
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
    formData.append("content_blocks", JSON.stringify(blocks));
    formData.append("status", status);
    formData.append("is_premium", String(isPremium));
    if (isPremium) formData.append("price", price);
    formData.append("is_highlighted", String(isHighlighted));
    formData.append("highlighted_until", isHighlighted ? highlightedUntil : "");

    if (coverFile) formData.append("cover_image", coverFile);

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
        <div className={styles.premiumToggleRow}>
          <button
            type="button"
            role="switch"
            aria-checked={isPremium}
            onClick={() => setIsPremium((prev) => !prev)}
            className={`${styles.premiumToggle} ${isPremium ? styles.premiumToggleOn : ""}`}
          >
            <span className={styles.premiumToggleThumb} />
          </button>
          <div>
            <p className={styles.premiumToggleLabel}>
              {isPremium ? "دراسة مميزة" : "دراسة مجانية"}
            </p>
            <p className={styles.premiumToggleHint}>
              {isPremium
                ? "تباع منفردة أو عبر اشتراك الدراسات السنوي"
                : "تظهر لجميع الزوار مجانًا"}
            </p>
          </div>
        </div>
        {isPremium && (
          <input
            type="number"
            min={0}
            step="0.01"
            className={styles.input}
            placeholder="سعر الدراسة (ريال)"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        )}
      </div>

      <div className={styles.field}>
        <div className={styles.premiumToggleRow}>
          <button
            type="button"
            role="switch"
            aria-checked={isHighlighted}
            onClick={() => setIsHighlighted((prev) => !prev)}
            className={`${styles.premiumToggle} ${isHighlighted ? styles.premiumToggleOn : ""}`}
          >
            <span className={styles.premiumToggleThumb} />
          </button>
          <div>
            <p className={styles.premiumToggleLabel}>
              {isHighlighted ? "دراسة مميزة" : "غير مميزة"}
            </p>
            <p className={styles.premiumToggleHint}>تظهر في أعلى صفحة الدراسات بتصميم مميز</p>
          </div>
        </div>
        {isHighlighted && (
          <div style={{ marginTop: "0.6rem" }}>
            <label htmlFor="studyHighlightedUntil" className={styles.label}>
              تنتهي الميزة في (اختياري)
            </label>
            <input
              id="studyHighlightedUntil"
              type="datetime-local"
              className={styles.input}
              value={highlightedUntil}
              onChange={(event) => setHighlightedUntil(event.target.value)}
            />
            <p className={styles.itemMeta}>اتركه فارغًا لتبقى الدراسة مميزة حتى تُلغى يدويًا.</p>
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>صورة الغلاف (تظهر في الخلفية العلوية)</label>
        {(coverPreviewUrl || currentCoverImageUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverPreviewUrl || currentCoverImageUrl || undefined} alt="" className={styles.imagePreview} />
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleCoverFileSelect}
        />
        <p className={styles.itemMeta}>
          النسبة المطلوبة: {COVER_ASPECT_LABEL} — بحجم أقصى 5 ميجابايت. بعد اختيار الصورة يمكنك تحريكها وتكبيرها
          لاختيار الجزء الذي تريد إظهاره قبل الحفظ.
        </p>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>محتوى الدراسة (أقسام)</label>
        <BlockEditor
          blocks={blocks}
          onChange={setBlocks}
          onUploadingChange={setUploading}
          uploadUrl="/api/admin/studies/upload-asset"
        />
        {currentPdfUrl && (
          <p className={styles.itemMeta}>
            كانت الدراسة تحتوي سابقًا على ملف PDF منفصل:{" "}
            <a href={currentPdfUrl} target="_blank" rel="noopener noreferrer" className={styles.currentFileLink}>
              عرض الملف القديم
            </a>{" "}
            — يمكنك إضافة ملف PDF جديد كأحد أقسام المحتوى أعلاه.
          </p>
        )}
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.button} disabled={submitState === "saving" || uploading}>
          {uploading ? "جارٍ رفع الملفات..." : submitState === "saving" ? "جارٍ الحفظ..." : "حفظ"}
        </button>
        {submitState === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </div>

      {cropFile && (
        <ImageCropper
          file={cropFile}
          aspectRatio={COVER_ASPECT_RATIO}
          title="قص صورة الغلاف"
          hint={`النسبة المطلوبة: ${COVER_ASPECT_LABEL}. اسحب الصورة لتحريكها واستخدم شريط التكبير لاختيار الجزء الذي يظهر.`}
          zoomLabel="التكبير"
          cancelLabel="إلغاء"
          confirmLabel="تم"
          onCancel={() => setCropFile(null)}
          onConfirm={handleCropConfirm}
        />
      )}
    </form>
  );
}
