"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { AdminBlogDetail, BlogCategory } from "@/lib/serverApi";
import styles from "./blogs.module.css";

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

  const [title, setTitle] = useState(initialBlog?.title || "");
  const [slug, setSlug] = useState(initialBlog?.slug || "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [authorName, setAuthorName] = useState(initialBlog?.author_name || "");
  const [categoryId, setCategoryId] = useState(initialBlog?.category_id?.toString() || "");
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt || "");
  const [content, setContent] = useState(initialBlog?.content || "");
  const [status, setStatus] = useState(initialBlog?.status || "draft");
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
    formData.append("author_name", authorName);
    formData.append("category_id", categoryId);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("status", status);

    const file = fileInputRef.current?.files?.[0];
    if (file) {
      formData.append("cover_image", file);
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
        <label className={styles.label}>صورة الغلاف</label>
        {currentCoverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentCoverImageUrl} alt="" className={styles.coverPreview} />
        )}
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>محتوى المقالة</label>
        <div className={styles.editorWrap}>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
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
