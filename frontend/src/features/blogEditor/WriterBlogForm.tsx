"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BlockEditor, type ContentBlock } from "./BlockEditor";
import type { Locale } from "@/i18n/config";
import type { BlogCategory, WriterBlogDetail } from "@/lib/serverApi";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import blockStyles from "./blockEditor.module.css";
import styles from "@/features/subscribers/subscribers.module.css";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type WriterBlogFormProps = {
  locale: Locale;
  mode: "create" | "edit";
  blogId?: number;
  categories: BlogCategory[];
  initialBlog?: WriterBlogDetail;
  currentCoverImageUrl?: string | null;
};

function parseInitialBlocks(raw: string | null | undefined): ContentBlock[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WriterBlogForm({ locale, mode, blogId, categories, initialBlog, currentCoverImageUrl }: WriterBlogFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialBlog?.title || "");
  const [categoryId, setCategoryId] = useState(initialBlog?.category_id?.toString() || "");
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt || "");
  const [blocks, setBlocks] = useState<ContentBlock[]>(parseInitialBlocks(initialBlog?.content_blocks));
  const [uploading, setUploading] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const captchaRequired = mode === "create" && Boolean(TURNSTILE_SITE_KEY);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (captchaRequired && !turnstileToken) {
      setSubmitState("error");
      setErrorMessage("يرجى إكمال التحقق (CAPTCHA) قبل المتابعة.");
      return;
    }

    setSubmitState("saving");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category_id", categoryId);
    formData.append("excerpt", excerpt);
    formData.append("content_blocks", JSON.stringify(blocks));
    if (mode === "create") formData.append("turnstile_token", turnstileToken);

    const file = fileInputRef.current?.files?.[0];
    if (file) formData.append("cover_image", file);

    const url = mode === "create" ? "/api/subscriber/blogs" : `/api/subscriber/blogs/${blogId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(url, { method, body: formData });
    const result = await response.json();

    if (result.success) {
      router.push(`/${locale}/account/blogs`);
      router.refresh();
    } else {
      setSubmitState("error");
      setErrorMessage(result.message || "فشل حفظ المقالة");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={blockStyles.formPage}>
      <h1 className={blockStyles.formTitle}>{mode === "create" ? "كتابة مقال جديد" : "تعديل المقال"}</h1>
      {initialBlog?.review_status === "rejected" && (
        <div className={styles.accountCard}>
          <p>تم رفض هذه المقالة سابقًا. سيتم إعادة إرسالها للمراجعة بعد الحفظ.</p>
          {initialBlog.review_reason && <p className={styles.expiresText}>السبب: {initialBlog.review_reason}</p>}
        </div>
      )}

      <div className={blockStyles.field}>
        <label className={blockStyles.label} htmlFor="writerBlogTitle">
          العنوان
        </label>
        <input
          id="writerBlogTitle"
          className={blockStyles.input}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className={blockStyles.field}>
        <label className={blockStyles.label} htmlFor="writerBlogCategory">
          التصنيف
        </label>
        <select
          id="writerBlogCategory"
          className={blockStyles.select}
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

      <div className={blockStyles.field}>
        <label className={blockStyles.label} htmlFor="writerBlogExcerpt">
          مقتطف قصير
        </label>
        <textarea
          id="writerBlogExcerpt"
          className={blockStyles.textarea}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          maxLength={500}
        />
      </div>

      <div className={blockStyles.field}>
        <label className={blockStyles.label}>صورة الغلاف</label>
        {currentCoverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentCoverImageUrl} alt="" className={blockStyles.blockImagePreview} />
        )}
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" />
        <p className={blockStyles.itemMeta}>الصيغ المقبولة: PNG أو JPEG أو WEBP، بحجم أقصى 5 ميجابايت.</p>
      </div>

      <div className={blockStyles.field}>
        <label className={blockStyles.label}>محتوى المقالة (أقسام)</label>
        <BlockEditor
          blocks={blocks}
          onChange={setBlocks}
          onUploadingChange={setUploading}
          uploadUrl="/api/subscriber/blogs/upload-asset"
        />
      </div>

      {captchaRequired && (
        <div className={blockStyles.field}>
          <TurnstileWidget
            siteKey={TURNSTILE_SITE_KEY}
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
          />
        </div>
      )}

      <button
        type="submit"
        className={styles.formSubmit}
        disabled={submitState === "saving" || uploading || (captchaRequired && !turnstileToken)}
      >
        {uploading ? "جارٍ رفع الملفات..." : submitState === "saving" ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
      </button>
      {submitState === "error" && <p className={styles.formStatusError}>{errorMessage}</p>}
    </form>
  );
}
