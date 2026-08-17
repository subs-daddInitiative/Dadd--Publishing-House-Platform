"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Subscriber, SubscriptionPlan, WriterUpgradeStatus } from "@/lib/serverApi";
import styles from "./subscribers.module.css";

type AccountViewProps = {
  locale: Locale;
  dictionary: Dictionary;
  subscriber: Subscriber;
  plans: SubscriptionPlan[];
  upgradeStatus: WriterUpgradeStatus;
};

const TIER_LABEL_KEY = {
  none: "tierNone",
  beginner: "tierBeginner",
  verified: "tierVerified",
} as const;

export function AccountView({ locale, dictionary, subscriber, plans, upgradeStatus }: AccountViewProps) {
  const router = useRouter();
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [requestPending, setRequestPending] = useState(false);
  const [error, setError] = useState("");

  const isWriter = subscriber.account_type === "writer";
  const visiblePlans = plans.filter(
    (plan) => plan.tier === "beginner" || upgradeStatus?.status === "invited"
  );

  async function handleSubscribe(planId: number) {
    setPendingPlanId(planId);
    setError("");

    const response = await fetch("/api/subscriber/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId, locale }),
    });
    const result = await response.json();

    if (result.success && result.data.redirect_url) {
      window.location.href = result.data.redirect_url;
    } else {
      setError(result.message || dictionary.authPage.errorGeneric);
      setPendingPlanId(null);
    }
  }

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

  async function handleLogout() {
    await fetch("/api/subscriber/logout", { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
  }

  const tierLabel = dictionary.accountPage[TIER_LABEL_KEY[subscriber.current_tier]];
  const cooldownActive =
    upgradeStatus?.status === "rejected" &&
    upgradeStatus.next_eligible_at &&
    new Date(upgradeStatus.next_eligible_at) > new Date();

  return (
    <div className={styles.accountPage}>
      <h1 className={styles.accountTitle}>{dictionary.accountPage.title}</h1>

      <div className={styles.accountCard}>
        <span className={styles.tierBadge}>{tierLabel}</span>
        {subscriber.tier_expires_at && (
          <p className={styles.expiresText}>
            {dictionary.accountPage.expiresLabel}: {new Date(subscriber.tier_expires_at).toLocaleDateString(locale)}
          </p>
        )}
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          {dictionary.accountPage.logout}
        </button>
      </div>

      {isWriter && (
        <>
          <h2 className={styles.accountTitle}>{dictionary.accountPage.writerSectionTitle}</h2>
          <Link href={`/${locale}/account/blogs`} className={styles.planButton}>
            {dictionary.accountPage.myBlogs}
          </Link>
          <div className={styles.accountCard}>
            {subscriber.current_tier !== "beginner" ? (
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

          <h2 className={styles.accountTitle}>{dictionary.accountPage.choosePlanTitle}</h2>
          <div className={styles.plansGrid}>
            {visiblePlans.map((plan) => {
              const price = Number(plan.price);
              const isActive = subscriber.current_tier === plan.tier;
              return (
                <div key={plan.id} className={styles.planCard}>
                  <div className={styles.planTier}>{dictionary.accountPage[TIER_LABEL_KEY[plan.tier]]}</div>
                  <div className={styles.planCycle}>
                    {plan.billing_cycle === "monthly" ? dictionary.accountPage.monthly : dictionary.accountPage.annual}
                  </div>
                  <div className={styles.planPrice}>
                    {price > 0 ? `${price.toFixed(2)} ${plan.currency}` : dictionary.accountPage.priceUnavailable}
                  </div>
                  <button
                    type="button"
                    className={styles.planButton}
                    disabled={price <= 0 || pendingPlanId === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isActive ? dictionary.accountPage.renewButton : dictionary.accountPage.subscribeButton}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {error && <p className={styles.formStatusError}>{error}</p>}
    </div>
  );
}
