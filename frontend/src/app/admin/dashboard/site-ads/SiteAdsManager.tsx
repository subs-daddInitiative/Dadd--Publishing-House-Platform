"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SiteAd, SiteAdTarget } from "@/lib/serverApi";
import { SiteAdTranslationsPanel } from "./SiteAdTranslationsPanel";
import styles from "./site-ads.module.css";

const TARGET_LABELS: Record<SiteAdTarget, string> = {
  all: "الجميع",
  guest: "الزوار غير المسجلين",
  reader: "القرّاء",
  writer: "الكُتّاب",
};

type SiteAdsManagerProps = {
  initialAds: SiteAd[];
};

export function SiteAdsManager({ initialAds }: SiteAdsManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ads, setAds] = useState(initialAds);
  const [expandedAdId, setExpandedAdId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [target, setTarget] = useState<SiteAdTarget>("all");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("link_url", linkUrl);
    formData.append("link_label", linkLabel);
    formData.append("target", target);
    formData.append("is_active", "1");
    formData.append("sort_order", String(ads.length));
    if (startsAt) formData.append("starts_at", startsAt.replace("T", " ") + ":00");
    if (endsAt) formData.append("ends_at", endsAt.replace("T", " ") + ":00");
    const file = fileInputRef.current?.files?.[0];
    if (file) formData.append("image", file);

    const response = await fetch("/api/admin/site-ads", { method: "POST", body: formData });
    const result = await response.json();

    if (result.success) {
      setAds((current) => [...current, result.data]);
      setTitle("");
      setMessage("");
      setLinkUrl("");
      setLinkLabel("");
      setTarget("all");
      setStartsAt("");
      setEndsAt("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشل إضافة الإعلان");
    }
    setStatus("idle");
  }

  async function handleToggleActive(ad: SiteAd) {
    setAds((current) => current.map((row) => (row.id === ad.id ? { ...row, is_active: ad.is_active ? 0 : 1 } : row)));
    await fetch(`/api/admin/site-ads/${ad.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: ad.title,
        message: ad.message,
        link_url: ad.link_url,
        link_label: ad.link_label,
        target: ad.target,
        is_active: !ad.is_active,
        sort_order: ad.sort_order ?? 0,
        starts_at: ad.starts_at ?? null,
        ends_at: ad.ends_at ?? null,
      }),
    });
    router.refresh();
  }

  async function handleDelete(id: number) {
    setAds((current) => current.filter((row) => row.id !== id));
    await fetch(`/api/admin/site-ads/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleCreate} className={styles.createForm} encType="multipart/form-data">
        <div className={styles.field}>
          <label htmlFor="adTitle" className={styles.label}>
            العنوان
          </label>
          <input
            id="adTitle"
            className={styles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={190}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="adMessage" className={styles.label}>
            النص (اختياري)
          </label>
          <textarea
            id="adMessage"
            className={styles.textarea}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={500}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="adLinkUrl" className={styles.label}>
              رابط (اختياري)
            </label>
            <input
              id="adLinkUrl"
              className={styles.input}
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="adLinkLabel" className={styles.label}>
              نص الزر (اختياري)
            </label>
            <input
              id="adLinkLabel"
              className={styles.input}
              value={linkLabel}
              onChange={(event) => setLinkLabel(event.target.value)}
              placeholder="اعرف أكثر"
            />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="adTarget" className={styles.label}>
            تظهر لـ
          </label>
          <select
            id="adTarget"
            className={styles.select}
            value={target}
            onChange={(event) => setTarget(event.target.value as SiteAdTarget)}
          >
            <option value="all">الجميع</option>
            <option value="guest">الزوار غير المسجلين</option>
            <option value="reader">القرّاء</option>
            <option value="writer">الكُتّاب</option>
          </select>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="adStartsAt" className={styles.label}>
              وقت البدء (اختياري)
            </label>
            <input
              id="adStartsAt"
              type="datetime-local"
              className={styles.input}
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="adEndsAt" className={styles.label}>
              وقت الانتهاء (اختياري)
            </label>
            <input
              id="adEndsAt"
              type="datetime-local"
              className={styles.input}
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
            />
          </div>
        </div>
        <p className={styles.hint}>اتركهما فارغين لعرض الإعلان بلا جدولة زمنية.</p>
        <div className={styles.field}>
          <label htmlFor="adImage" className={styles.label}>
            صورة (اختياري)
          </label>
          <input ref={fileInputRef} id="adImage" type="file" accept="image/png,image/jpeg,image/webp" />
        </div>
        <button type="submit" className={styles.button} disabled={status === "saving"}>
          {status === "saving" ? "جارٍ الإضافة..." : "إضافة إعلان"}
        </button>
        {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </form>

      {ads.length === 0 ? (
        <p className={styles.empty}>لا توجد إعلانات بعد.</p>
      ) : (
        <ul className={styles.list}>
          {ads.map((ad) => (
            <li key={ad.id} className={styles.item}>
              {ad.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.image} alt="" className={styles.thumb} />
              )}
              <div className={styles.itemBody}>
                <p className={styles.itemTitle}>{ad.title}</p>
                <p className={styles.itemMeta}>
                  {TARGET_LABELS[ad.target]} · {ad.is_active ? "فعّال" : "غير فعّال"}
                  {(ad.starts_at || ad.ends_at) && (
                    <>
                      {" · "}
                      {ad.starts_at ? new Date(ad.starts_at).toLocaleString("ar") : "الآن"}
                      {" → "}
                      {ad.ends_at ? new Date(ad.ends_at).toLocaleString("ar") : "بلا نهاية"}
                    </>
                  )}
                </p>
              </div>
              <div className={styles.itemActions}>
                <button type="button" className={styles.buttonSecondary} onClick={() => handleToggleActive(ad)}>
                  {ad.is_active ? "إيقاف" : "تفعيل"}
                </button>
                <button
                  type="button"
                  className={styles.buttonSecondary}
                  onClick={() => setExpandedAdId((current) => (current === ad.id ? null : ad.id))}
                >
                  {expandedAdId === ad.id ? "إخفاء الترجمات" : "الترجمات"}
                </button>
                <button type="button" className={styles.buttonDanger} onClick={() => handleDelete(ad.id)}>
                  حذف
                </button>
              </div>
              {expandedAdId === ad.id && <SiteAdTranslationsPanel adId={ad.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
