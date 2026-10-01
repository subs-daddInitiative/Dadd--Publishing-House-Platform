"use client";

import { useState } from "react";
import styles from "./ShareBar.module.css";

type ShareBarLabels = {
  label: string;
  copyLink: string;
  copied: string;
  whatsapp: string;
  telegram: string;
  x: string;
  facebook: string;
  linkedin: string;
  email: string;
};

type ShareBarProps = {
  url: string;
  title: string;
  labels: ShareBarLabels;
};

const COPIED_RESET_MS = 2000;

export function ShareBar({ url, title, labels }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const targets = [
    { name: labels.whatsapp, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { name: labels.telegram, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { name: labels.x, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { name: labels.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: labels.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: labels.email, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      window.prompt(labels.copyLink, url);
    }
  }

  return (
    <div className={styles.bar} role="group" aria-label={labels.label}>
      <span className={styles.label}>{labels.label}</span>
      <button type="button" className={styles.chip} onClick={copyLink} aria-live="polite">
        {copied ? labels.copied : labels.copyLink}
      </button>
      {targets.map((target) => (
        <a
          key={target.name}
          className={styles.chip}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {target.name}
        </a>
      ))}
    </div>
  );
}
