"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./settings.module.css";

const PLATFORMS = [
  { key: "facebook", label: "فيسبوك" },
  { key: "instagram", label: "إنستغرام" },
  { key: "tiktok", label: "تيك توك" },
  { key: "snapchat", label: "سناب شات" },
  { key: "linkedin", label: "لينكدإن" },
] as const;

type SocialLinksFormProps = {
  initialLinks: { platform: string; url: string }[];
};

export function SocialLinksForm({ initialLinks }: SocialLinksFormProps) {
  const router = useRouter();
  const initialMap = Object.fromEntries(initialLinks.map((link) => [link.platform, link.url]));
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(PLATFORMS.map((platform) => [platform.key, initialMap[platform.key] || ""]))
  );
  const [statusByPlatform, setStatusByPlatform] = useState<Record<string, "idle" | "saving" | "saved" | "error">>({});

  async function saveLink(platform: string) {
    const url = values[platform]?.trim();
    setStatusByPlatform((prev) => ({ ...prev, [platform]: "saving" }));

    if (!url) {
      const response = await fetch(`/api/admin/settings/social-links/${platform}`, { method: "DELETE" });
      const result = await response.json();
      setStatusByPlatform((prev) => ({ ...prev, [platform]: result.success ? "saved" : "error" }));
      router.refresh();
      return;
    }

    const response = await fetch("/api/admin/settings/social-links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, url }),
    });
    const result = await response.json();
    setStatusByPlatform((prev) => ({ ...prev, [platform]: result.success ? "saved" : "error" }));
    router.refresh();
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>روابط التواصل الاجتماعي</h2>
      {PLATFORMS.map((platform) => (
        <div className={styles.row} key={platform.key}>
          <div className={styles.field}>
            <label htmlFor={platform.key} className={styles.label}>{platform.label}</label>
            <input
              id={platform.key}
              className={styles.input}
              placeholder="https://..."
              value={values[platform.key]}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [platform.key]: event.target.value }))
              }
            />
          </div>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => saveLink(platform.key)}
            disabled={statusByPlatform[platform.key] === "saving"}
          >
            حفظ
          </button>
        </div>
      ))}
    </div>
  );
}
