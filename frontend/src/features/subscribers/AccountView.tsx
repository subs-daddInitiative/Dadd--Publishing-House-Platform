"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Subscriber, SubscriptionPlan, WriterUpgradeStatus } from "@/lib/serverApi";
import { formatCurrency } from "@/lib/currency";
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

  async function handleLogout() {
    await fetch("/api/subscriber/logout", { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
  }

  const tierLabel = dictionary.accountPage[TIER_LABEL_KEY[subscriber.current_tier]];

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
          <div className={styles.accountCard}>
            <Link href={`/${locale}/account/blogs`} className={styles.planButton}>
              {dictionary.accountPage.myBlogs}
            </Link>
            {subscriber.current_tier !== "verified" && (
              <Link href={`/${locale}/account/writer-upgrade`} className={styles.planButton}>
                {dictionary.accountPage.navWriterUpgrade}
              </Link>
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
                    {price > 0 ? formatCurrency(price, plan.currency) : dictionary.accountPage.priceUnavailable}
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
