"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./settings.module.css";

type Banner = {
  id: number;
  title: string | null;
  image: string;
  is_active: number;
};

type BannersManagerProps = {
  banners: Banner[];
  backendUrl: string;
};

export function BannersManager({ banners, backendUrl }: BannersManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setStatus("saving");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("is_active", "1");

    const response = await fetch("/api/admin/banners", { method: "POST", body: formData });
    const result = await response.json();

    if (result.success) {
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشل إضافة البانر");
    }
    setStatus("idle");
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>البانرات (الصفحة الرئيسية)</h2>

      <ul className={styles.bannerList}>
        {banners.map((banner) => (
          <li key={banner.id} className={styles.bannerItem}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${backendUrl}${banner.image}`} alt={banner.title || ""} className={styles.bannerImage} />
            <div className={styles.bannerInfo}>
              <p className={styles.bannerTitle}>{banner.title || "بدون عنوان"}</p>
              <p className={styles.bannerMeta}>{banner.is_active ? "مفعّل" : "غير مفعّل"}</p>
            </div>
            <button type="button" className={styles.buttonDanger} onClick={() => handleDelete(banner.id)}>
              حذف
            </button>
          </li>
        ))}
        {banners.length === 0 && <p className={styles.bannerMeta}>لا توجد بانرات بعد.</p>}
      </ul>

      <form onSubmit={handleCreate} className={styles.createBannerForm}>
        <div className={styles.field}>
          <label htmlFor="bannerTitle" className={styles.label}>عنوان البانر (اختياري)</label>
          <input
            id="bannerTitle"
            className={styles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="bannerImage" className={styles.label}>صورة البانر</label>
          <input ref={fileInputRef} id="bannerImage" type="file" accept="image/png,image/jpeg,image/webp" required />
        </div>
        <button type="submit" className={styles.button} disabled={status === "saving"}>
          {status === "saving" ? "جارٍ الإضافة..." : "إضافة بانر"}
        </button>
        {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </form>
    </div>
  );
}
