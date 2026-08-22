"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ContentAccessPlan } from "@/lib/serverApi";
import { formatCurrency } from "@/lib/currency";
import styles from "./subscribers.module.css";

type PremiumLockProps = {
  locale: Locale;
  dictionary: Dictionary;
  category: "blogs" | "studies";
  isLoggedIn: boolean;
  plans: ContentAccessPlan[];
  studyId?: number;
  studyPrice?: string | null;
  studyCurrency?: string;
};

export function PremiumLock({
  locale,
  dictionary,
  category,
  isLoggedIn,
  plans,
  studyId,
  studyPrice,
  studyCurrency,
}: PremiumLockProps) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function subscribeToPlan(planId: number) {
    setPending(`plan-${planId}`);
    setError("");
    const response = await fetch("/api/subscriber/content-access/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId, locale }),
    });
    const result = await response.json();
    if (result.success && result.data.redirect_url) {
      window.location.href = result.data.redirect_url;
    } else {
      setError(result.message || dictionary.authPage.errorGeneric);
      setPending(null);
    }
  }

  async function purchaseThisStudy() {
    if (!studyId) return;
    setPending("study");
    setError("");
    const response = await fetch(`/api/subscriber/studies/${studyId}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    const result = await response.json();
    if (result.success && result.data.redirect_url) {
      window.location.href = result.data.redirect_url;
    } else {
      setError(result.message || dictionary.authPage.errorGeneric);
      setPending(null);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.accountCard}>
        <p>{dictionary.premiumLock.mustRegister}</p>
        <Link href={`/${locale}/register`} className={styles.planButton}>
          {dictionary.premiumLock.registerNow}
        </Link>
        <p className={styles.formSwitch}>
          {dictionary.authPage.haveAccount}{" "}
          <Link href={`/${locale}/login`}>{dictionary.authPage.switchToLogin}</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.accountCard}>
      <p>
        {category === "blogs" ? dictionary.premiumLock.blogsLocked : dictionary.premiumLock.studiesLocked}
      </p>

      {category === "studies" && studyId && Number(studyPrice) > 0 && (
        <button
          type="button"
          className={styles.planButton}
          disabled={pending !== null}
          onClick={purchaseThisStudy}
        >
          {dictionary.premiumLock.buyThisStudy} - {formatCurrency(Number(studyPrice), studyCurrency || "USD")}
        </button>
      )}

      <div className={styles.plansGrid}>
        {plans.map((plan) => {
          const price = Number(plan.price);
          return (
            <div key={plan.id} className={styles.planCard}>
              <div className={styles.planCycle}>
                {plan.billing_cycle === "monthly" ? dictionary.accountPage.monthly : dictionary.accountPage.annual}
              </div>
              <div className={styles.planPrice}>
                {price > 0 ? formatCurrency(price, plan.currency) : dictionary.accountPage.priceUnavailable}
              </div>
              <button
                type="button"
                className={styles.planButton}
                disabled={price <= 0 || pending !== null}
                onClick={() => subscribeToPlan(plan.id)}
              >
                {dictionary.accountPage.subscribeButton}
              </button>
            </div>
          );
        })}
      </div>

      {error && <p className={styles.formStatusError}>{error}</p>}
    </div>
  );
}
