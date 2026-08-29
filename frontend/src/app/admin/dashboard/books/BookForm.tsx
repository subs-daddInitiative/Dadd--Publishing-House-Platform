"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AdminBookDetail, BookCategory, BookPricingTier } from "@/lib/serverApi";
import styles from "./books.module.css";

type ExternalLinkRow = { label: string; url: string };

type BookFormProps = {
  mode: "create" | "edit";
  bookId?: number;
  categories: BookCategory[];
  tiers: BookPricingTier[];
  initialBook?: AdminBookDetail;
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

export function BookForm({
  mode,
  bookId,
  categories,
  tiers,
  initialBook,
  currentCoverImageUrl,
  currentPdfUrl,
}: BookFormProps) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialBook?.title || "");
  const [slug, setSlug] = useState(initialBook?.slug || "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [author, setAuthor] = useState(initialBook?.author || "");
  const [categoryId, setCategoryId] = useState(initialBook?.category_id?.toString() || "");
  const [description, setDescription] = useState(initialBook?.description || "");
  const [pricingMode, setPricingMode] = useState<"fixed" | "tier">(
    initialBook?.pricing_tier_id ? "tier" : "fixed"
  );
  const [price, setPrice] = useState(initialBook?.price?.toString() || "");
  const [pricingTierId, setPricingTierId] = useState(
    initialBook?.pricing_tier_id?.toString() || tiers[0]?.id.toString() || ""
  );
  const [currency, setCurrency] = useState(initialBook?.currency || "USD");
  const [rating, setRating] = useState(initialBook?.rating?.toString() || "");
  const [reviewsCount, setReviewsCount] = useState(initialBook?.reviews_count?.toString() || "0");
  const [status, setStatus] = useState(initialBook?.status || "draft");
  const [links, setLinks] = useState<ExternalLinkRow[]>(
    initialBook?.external_links.map((link) => ({ label: link.label, url: link.url })) || []
  );
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function updateLink(index: number, field: "label" | "url", value: string) {
    setLinks((current) => current.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  }

  function removeLink(index: number) {
    setLinks((current) => current.filter((_, i) => i !== index));
  }

  function addLink() {
    setLinks((current) => [...current, { label: "", url: "" }]);
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
    if (pricingMode === "tier") {
      formData.append("pricing_tier_id", pricingTierId);
      formData.append("price", "");
    } else {
      formData.append("pricing_tier_id", "");
      formData.append("price", price);
    }
    formData.append("currency", currency);
    formData.append("rating", rating);
    formData.append("reviews_count", reviewsCount);
    formData.append("status", status);
    formData.append(
      "external_links",
      JSON.stringify(links.filter((link) => link.label.trim() && link.url.trim()))
    );

    const coverFile = coverInputRef.current?.files?.[0];
    if (coverFile) formData.append("cover_image", coverFile);
    const pdfFile = pdfInputRef.current?.files?.[0];
    if (pdfFile) formData.append("pdf_file", pdfFile);

    const url = mode === "create" ? "/api/admin/books" : `/api/admin/books/${bookId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(url, { method, body: formData });
    const result = await response.json();

    if (result.success) {
      router.push("/admin/dashboard/books");
      router.refresh();
    } else {
      setSubmitState("error");
      setErrorMessage(result.message || "فشل حفظ الكتاب");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="bookTitle" className={styles.label}>
          العنوان
        </label>
        <input
          id="bookTitle"
          className={styles.input}
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="bookSlug" className={styles.label}>
          الرابط المختصر (slug)
        </label>
        <input
          id="bookSlug"
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
          <label htmlFor="bookAuthor" className={styles.label}>
            المؤلف
          </label>
          <input
            id="bookAuthor"
            className={styles.input}
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="bookCategory" className={styles.label}>
            التصنيف
          </label>
          <select
            id="bookCategory"
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
          <label htmlFor="bookStatus" className={styles.label}>
            الحالة
          </label>
          <select
            id="bookStatus"
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
        <label htmlFor="bookDescription" className={styles.label}>
          الوصف
        </label>
        <textarea
          id="bookDescription"
          className={styles.textarea}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>التسعير</label>
        <div className={styles.pricingModeRow}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="pricingMode"
              checked={pricingMode === "fixed"}
              onChange={() => setPricingMode("fixed")}
            />{" "}
            سعر ثابت
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="pricingMode"
              checked={pricingMode === "tier"}
              onChange={() => setPricingMode("tier")}
              disabled={tiers.length === 0}
            />{" "}
            اختيار باقة تسعير
          </label>
        </div>

        {pricingMode === "fixed" ? (
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="bookPrice" className={styles.label}>
                السعر
              </label>
              <input
                id="bookPrice"
                type="number"
                step="0.01"
                min="0"
                className={styles.input}
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="bookCurrency" className={styles.label}>
                العملة
              </label>
              <input
                id="bookCurrency"
                className={styles.input}
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                maxLength={6}
              />
            </div>
          </div>
        ) : (
          <div className={styles.field}>
            <label htmlFor="bookPricingTier" className={styles.label}>
              الباقة
            </label>
            <select
              id="bookPricingTier"
              className={styles.select}
              value={pricingTierId}
              onChange={(event) => setPricingTierId(event.target.value)}
            >
              {tiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name} ({tier.price} {tier.currency})
                </option>
              ))}
            </select>
            <p className={styles.hintText}>
              يتغيّر سعر هذا الكتاب تلقائيًا عند تعديل سعر الباقة من الإعدادات.
            </p>
          </div>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="bookRating" className={styles.label}>
            التقييم (0-5)
          </label>
          <input
            id="bookRating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            className={styles.input}
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="bookReviewsCount" className={styles.label}>
            عدد التقييمات
          </label>
          <input
            id="bookReviewsCount"
            type="number"
            step="1"
            min="0"
            className={styles.input}
            value={reviewsCount}
            onChange={(event) => setReviewsCount(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>صورة الغلاف</label>
        {currentCoverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentCoverImageUrl} alt="" className={styles.imagePreview} />
        )}
        <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp" />
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

      <div className={styles.field}>
        <label className={styles.label}>روابط شراء خارجية</label>
        {links.map((link, index) => (
          <div key={index} className={styles.linkRow}>
            <input
              className={styles.input}
              placeholder="اسم المتجر"
              value={link.label}
              onChange={(event) => updateLink(index, "label", event.target.value)}
            />
            <input
              className={styles.input}
              placeholder="https://..."
              value={link.url}
              onChange={(event) => updateLink(index, "url", event.target.value)}
            />
            <button type="button" className={styles.buttonDanger} onClick={() => removeLink(index)}>
              حذف
            </button>
          </div>
        ))}
        <button type="button" className={styles.addLinkButton} onClick={addLink}>
          إضافة رابط
        </button>
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
