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

    fetch(`/api/subscriber/subscriptions/status?tap_id=${encodeURIComponent(tapId)}`)
      .then((response) => response.json())
      .then((result) => {
        setStatus(result.success && result.data.status === "active" ? "active" : "failed");
      })
      .catch(() => setStatus("failed"));
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
