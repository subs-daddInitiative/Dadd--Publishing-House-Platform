"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Subscriber, WriterUpgradeStatus } from "@/lib/serverApi";
import styles from "./subscribers.module.css";

type WriterUpgradeViewProps = {
  locale: Locale;
  dictionary: Dictionary;
  subscriber: Subscriber;
  upgradeStatus: WriterUpgradeStatus;
};

export function WriterUpgradeView({ locale, dictionary, subscriber, upgradeStatus }: WriterUpgradeViewProps) {
  const router = useRouter();
  const [requestPending, setRequestPending] = useState(false);
  const [error, setError] = useState("");

  async function handleRequestUpgrade() {
    setRequestPending(true);
    setError("");

    const response = await fetch("/api/subscriber/writer-upgrade/request", { method: "POST" });
    const result = await response.json();

    if (result.success) {
      router.refresh();
    } else {
      setError(result.message || dictionary.authPage.errorGeneric);
    }
    setRequestPending(false);
  }

  const cooldownActive =
    upgradeStatus?.status === "rejected" &&
    upgradeStatus.next_eligible_at &&
    new Date(upgradeStatus.next_eligible_at) > new Date();

  return (
    <div className={styles.accountPage}>
      <h1 className={styles.accountTitle}>{dictionary.accountPage.navWriterUpgrade}</h1>

      <div className={styles.accountCard}>
        {subscriber.current_tier === "verified" ? (
          <p className={styles.tierBadge}>{dictionary.accountPage.tierVerified}</p>
        ) : subscriber.current_tier !== "beginner" ? (
          <p>{dictionary.accountPage.mustBeBeginnerFirst}</p>
        ) : upgradeStatus?.status === "pending" ? (
          <p>{dictionary.accountPage.requestPending}</p>
        ) : upgradeStatus?.status === "invited" ? (
          <p>{dictionary.accountPage.requestInvited}</p>
        ) : upgradeStatus?.status === "rejected" ? (
          <>
            <p>{dictionary.accountPage.requestRejected}</p>
            {upgradeStatus.reason && (
              <p className={styles.expiresText}>
                {dictionary.accountPage.rejectionReasonLabel}: {upgradeStatus.reason}
              </p>
            )}
            {cooldownActive && upgradeStatus.next_eligible_at && (
              <p className={styles.expiresText}>
                {dictionary.accountPage.nextEligibleLabel}:{" "}
                {new Date(upgradeStatus.next_eligible_at).toLocaleDateString(locale)}
              </p>
            )}
            {!cooldownActive && (
              <button
                type="button"
                className={styles.planButton}
                disabled={requestPending}
                onClick={handleRequestUpgrade}
              >
                {dictionary.accountPage.requestUpgrade}
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            className={styles.planButton}
            disabled={requestPending}
            onClick={handleRequestUpgrade}
          >
            {dictionary.accountPage.requestUpgrade}
          </button>
        )}
      </div>

      {error && <p className={styles.formStatusError}>{error}</p>}
    </div>
  );
}
