"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BlockEditor, type ContentBlock } from "@/features/blogEditor/BlockEditor";
import { ImageCropper } from "@/components/ImageCropper";
import type { AdminBlogDetail, BlogCategory } from "@/lib/serverApi";
import styles from "./blogs.module.css";

const COVER_ASPECT_RATIO = 16 / 8;
const COVER_ASPECT_LABEL = "2:1 (مثال: 1600×800 بكسل)";

type BlogFormProps = {
  mode: "create" | "edit";
  blogId?: number;
  categories: BlogCategory[];
  initialBlog?: AdminBlogDetail;
  currentCoverImageUrl?: string | null;
  defaultAuthorName?: string;
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

export function BlogForm({
  mode,
  blogId,
  categories,
  initialBlog,
  currentCoverImageUrl,
  defaultAuthorName,
}: BlogFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);

  const [title, setTitle] = useState(initialBlog?.title || "");
  const [slug, setSlug] = useState(initialBlog?.slug || "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [authorName, setAuthorName] = useState(initialBlog?.author_name || "");
  const [categoryId, setCategoryId] = useState(initialBlog?.category_id?.toString() || "");
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt || "");
  const [blocks, setBlocks] = useState<ContentBlock[]>(parseInitialBlocks(initialBlog?.content_blocks));
  const [seoKeywords, setSeoKeywords] = useState(initialBlog?.seo_keywords || "");
  const [status, setStatus] = useState(initialBlog?.status || "draft");
  const [isPremium, setIsPremium] = useState(Boolean(initialBlog?.is_premium));
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
    formData.append("author_name", authorName);
    formData.append("category_id", categoryId);
    formData.append("excerpt", excerpt);
    formData.append("content_blocks", JSON.stringify(blocks));
    formData.append("seo_keywords", seoKeywords);
    formData.append("status", status);
    formData.append("is_premium", String(isPremium));

    if (coverFile) {
      formData.append("cover_image", coverFile);
    }

    const url = mode === "create" ? "/api/admin/blogs" : `/api/admin/blogs/${blogId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(url, { method, body: formData });
    const result = await response.json();

    if (result.success) {
      router.push("/admin/dashboard/blogs");
      router.refresh();
    } else {
      setSubmitState("error");
      setErrorMessage(result.message || "فشل حفظ المقالة");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="blogTitle" className={styles.label}>
          العنوان
        </label>
        <input
          id="blogTitle"
          className={styles.input}
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="blogSlug" className={styles.label}>
          الرابط المختصر (slug)
        </label>
        <input
          id="blogSlug"
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
        <label htmlFor="blogAuthor" className={styles.label}>
          اسم الكاتب
        </label>
        <input
          id="blogAuthor"
          className={styles.input}
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          placeholder={defaultAuthorName ? `اتركه فارغًا لاستخدام "${defaultAuthorName}"` : "اسم الكاتب"}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="blogCategory" className={styles.label}>
            التصنيف
          </label>
          <select
            id="blogCategory"
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
          <label htmlFor="blogStatus" className={styles.label}>
            الحالة
          </label>
          <select
            id="blogStatus"
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
        <label htmlFor="blogExcerpt" className={styles.label}>
          مقتطف قصير
        </label>
        <textarea
          id="blogExcerpt"
          className={styles.textarea}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
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
              {isPremium ? "مقالة للمشتركين فقط" : "مقالة مجانية"}
            </p>
            <p className={styles.premiumToggleHint}>
              {isPremium
                ? "لن تظهر إلا لمن يملك اشتراك المدونة المميزة"
                : "تظهر لجميع الزوار مجانًا"}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>صورة الغلاف</label>
        {(coverPreviewUrl || currentCoverImageUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverPreviewUrl || currentCoverImageUrl || undefined} alt="" className={styles.coverPreview} />
        )}
        <input
          ref={fileInputRef}
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
        <label className={styles.label}>محتوى المقالة (أقسام)</label>
        <BlockEditor
          blocks={blocks}
          onChange={setBlocks}
          onUploadingChange={setUploading}
          uploadUrl="/api/admin/blogs/upload-asset"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="blogSeoKeywords" className={styles.label}>
          كلمات مفتاحية لتحسين محركات البحث (SEO) - لا تظهر للزوار
        </label>
        <input
          id="blogSeoKeywords"
          className={styles.input}
          value={seoKeywords}
          onChange={(event) => setSeoKeywords(event.target.value)}
          placeholder="افصل بين الكلمات بفواصل"
        />
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
