"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./subscribers.module.css";

type SubscribeResultViewProps = {
  locale: Locale;
  dictionary: Dictionary;
  tapId: string | null;
};

export function SubscribeResultView({ locale, dictionary, tapId }: SubscribeResultViewProps) {
  const [status, setStatus] = useState<"checking" | "active" | "failed">("checking");

  useEffect(() => {
    if (!tapId) {
      setStatus("failed");
      return;
    }

    async function checkStatus() {
      const encodedId = encodeURIComponent(tapId!);

      // The charge could belong to a writer-tier subscription OR a
      // content-access (blogs/studies) checkout - try both endpoints since
      // the result page doesn't otherwise know which flow redirected here.
      const writerTier = await fetch(`/api/subscriber/subscriptions/status?tap_id=${encodedId}`)
        .then((response) => response.json())
        .catch(() => null);
      if (writerTier?.success) {
        setStatus(writerTier.data.status === "active" ? "active" : "failed");
        return;
      }

      const contentAccess = await fetch(`/api/subscriber/content-access/status?tap_id=${encodedId}`)
        .then((response) => response.json())
        .catch(() => null);
      if (contentAccess?.success) {
        setStatus(["active", "completed"].includes(contentAccess.data.status) ? "active" : "failed");
        return;
      }

      setStatus("failed");
    }

    checkStatus();
  }, [tapId]);

  return (
    <div className={styles.resultPage}>
      <h1 className={styles.accountTitle}>{dictionary.subscribeResultPage.title}</h1>
      <p>
        {status === "checking"
          ? dictionary.subscribeResultPage.checking
          : status === "active"
            ? dictionary.subscribeResultPage.success
            : dictionary.subscribeResultPage.failed}
      </p>
      <Link href={`/${locale}/account`}>{dictionary.subscribeResultPage.backToAccount}</Link>
    </div>
  );
}
