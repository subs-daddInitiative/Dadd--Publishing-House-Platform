"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TranslationsPanel } from "@/components/admin/TranslationsPanel";
import styles from "./settings.module.css";

const TRANSLATION_FIELDS = [
  { key: "title", label: "العنوان" },
  { key: "description", label: "الوصف", multiline: true },
];

type AboutFeature = {
  id: number;
  icon: string | null;
  title: string;
  description: string | null;
};

type AboutFeaturesManagerProps = {
  features: AboutFeature[];
};

export function AboutFeaturesManager({ features }: AboutFeaturesManagerProps) {
  const router = useRouter();
  const [icon, setIcon] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editIcon, setEditIcon] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch("/api/admin/about-features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icon, title, description }),
    });
    const result = await response.json();

    if (result.success) {
      setIcon("");
      setTitle("");
      setDescription("");
      router.refresh();
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشلت العملية");
      return;
    }
    setStatus("idle");
  }

  function startEditing(feature: AboutFeature) {
    setEditingId(feature.id);
    setEditIcon(feature.icon || "");
    setEditTitle(feature.title);
    setEditDescription(feature.description || "");
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId || !editTitle.trim()) return;

    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch(`/api/admin/about-features/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icon: editIcon, title: editTitle, description: editDescription }),
    });
    const result = await response.json();

    if (result.success) {
      setEditingId(null);
      router.refresh();
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشلت العملية");
      return;
    }
    setStatus("idle");
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/about-features/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>بطاقات قسم &quot;من نحن&quot;</h2>

      <ul className={styles.bannerList}>
        {features.map((feature) =>
          editingId === feature.id ? (
            <li key={feature.id} className={styles.bannerItem}>
              <form onSubmit={handleUpdate} className={styles.editRow}>
                <input
                  className={`${styles.input} ${styles.iconField}`}
                  value={editIcon}
                  onChange={(event) => setEditIcon(event.target.value)}
                  placeholder="🌟"
                  maxLength={4}
                />
                <input
                  className={styles.input}
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  required
                />
                <input
                  className={styles.input}
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                />
                <button type="submit" className={styles.button} disabled={status === "saving"}>
                  حفظ
                </button>
                <button type="button" className={styles.buttonSecondary} onClick={() => setEditingId(null)}>
                  إلغاء
                </button>
              </form>
            </li>
          ) : (
            <li key={feature.id} className={styles.bannerItem}>
              <div className={styles.bannerInfo}>
                <p className={styles.bannerTitle}>
                  {feature.icon} {feature.title}
                </p>
                <p className={styles.bannerMeta}>{feature.description}</p>
                {expandedId === feature.id && (
                  <TranslationsPanel
                    apiBase={`/api/admin/about-features/${feature.id}`}
                    fields={TRANSLATION_FIELDS}
                  />
                )}
              </div>
              <button type="button" className={styles.buttonSecondary} onClick={() => startEditing(feature)}>
                تعديل
              </button>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => setExpandedId((current) => (current === feature.id ? null : feature.id))}
              >
                {expandedId === feature.id ? "إخفاء الترجمات" : "الترجمات"}
              </button>
              <button type="button" className={styles.buttonDanger} onClick={() => handleDelete(feature.id)}>
                حذف
              </button>
            </li>
          )
        )}
        {features.length === 0 && <p className={styles.bannerMeta}>لا توجد بطاقات بعد.</p>}
      </ul>

      <form onSubmit={handleCreate} className={styles.createBannerForm}>
        <div className={styles.row}>
          <div className={`${styles.field} ${styles.iconField}`}>
            <label htmlFor="featureIcon" className={styles.label}>
              الأيقونة (إيموجي)
            </label>
            <input
              id="featureIcon"
              className={styles.input}
              value={icon}
              onChange={(event) => setIcon(event.target.value)}
              placeholder="📚"
              maxLength={4}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="featureTitle" className={styles.label}>
              العنوان
            </label>
            <input
              id="featureTitle"
              className={styles.input}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="featureDescription" className={styles.label}>
            الوصف
          </label>
          <textarea
            id="featureDescription"
            className={styles.textarea}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <button type="submit" className={styles.button} disabled={status === "saving"}>
          {status === "saving" ? "جارٍ الإضافة..." : "إضافة بطاقة"}
        </button>
        {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </form>
    </div>
  );
}
