"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { ContentAccessPlan } from "@/lib/serverApi";
import { formatCurrency } from "@/lib/currency";
import styles from "./subscribers.module.css";

type BlogSubscriptionCardsProps = {
  locale: Locale;
  dictionary: Dictionary;
  isLoggedIn: boolean;
  blogAccessExpiresAt: string | null;
  plans: ContentAccessPlan[];
};

export function BlogSubscriptionCards({
  locale,
  dictionary,
  isLoggedIn,
  blogAccessExpiresAt,
  plans,
}: BlogSubscriptionCardsProps) {
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const isActive = blogAccessExpiresAt && new Date(blogAccessExpiresAt) > new Date();
  const monthly = plans.find((plan) => plan.billing_cycle === "monthly");
  const annual = plans.find((plan) => plan.billing_cycle === "annual");

  async function handleSubscribe(planId: number) {
    setPendingPlanId(planId);
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
      setPendingPlanId(null);
    }
  }

  return (
    <div className={styles.subscribePage}>
      <div className={styles.subscribeHeader}>
        <h1 className={styles.subscribeTitle}>{dictionary.subscribePage.title}</h1>
        <p className={styles.subscribeSubtitle}>{dictionary.subscribePage.subtitle}</p>
      </div>

      {isActive && (
        <div className={styles.subscribeActiveBanner}>
          <p className={styles.premiumToggleLabel}>{dictionary.subscribePage.alreadySubscribedTitle}</p>
          <p>
            {dictionary.subscribePage.alreadySubscribedText}{" "}
            {new Date(blogAccessExpiresAt!).toLocaleDateString(locale)}
          </p>
        </div>
      )}

      <div className={styles.subscribeCardsGrid}>
        {monthly && (
          <SubscriptionCard
            title={dictionary.subscribePage.monthlyCardTitle}
            price={monthly.price}
            currency={monthly.currency}
            periodLabel={dictionary.subscribePage.perMonth}
            dictionary={dictionary}
            isLoggedIn={isLoggedIn}
            locale={locale}
            disabled={Number(monthly.price) <= 0 || pendingPlanId === monthly.id}
            onSubscribe={() => handleSubscribe(monthly.id)}
          />
        )}
        {annual && (
          <SubscriptionCard
            title={dictionary.subscribePage.annualCardTitle}
            price={annual.price}
            currency={annual.currency}
            periodLabel={dictionary.subscribePage.perYear}
            dictionary={dictionary}
            isLoggedIn={isLoggedIn}
            locale={locale}
            highlighted
            badge={dictionary.subscribePage.annualBadge}
            disabled={Number(annual.price) <= 0 || pendingPlanId === annual.id}
            onSubscribe={() => handleSubscribe(annual.id)}
          />
        )}
      </div>

      {error && <p className={styles.formStatusError}>{error}</p>}
    </div>
  );
}

type SubscriptionCardProps = {
  title: string;
  price: string;
  currency: string;
  periodLabel: string;
  dictionary: Dictionary;
  isLoggedIn: boolean;
  locale: Locale;
  highlighted?: boolean;
  badge?: string;
  disabled: boolean;
  onSubscribe: () => void;
};

function SubscriptionCard({
  title,
  price,
  currency,
  periodLabel,
  dictionary,
  isLoggedIn,
  locale,
  highlighted,
  badge,
  disabled,
  onSubscribe,
}: SubscriptionCardProps) {
  const priceValue = Number(price);

  return (
    <div className={`${styles.subscribeCard} ${highlighted ? styles.subscribeCardHighlighted : ""}`}>
      {badge && <span className={styles.subscribeCardBadge}>{badge}</span>}
      <h2 className={styles.subscribeCardTitle}>{title}</h2>
      <p className={styles.subscribeCardPrice}>
        {priceValue > 0 ? (
          <>
            {formatCurrency(priceValue, currency)}
            <span className={styles.subscribeCardPeriod}>{periodLabel}</span>
          </>
        ) : (
          dictionary.subscribePage.priceUnavailable
        )}
      </p>

      <ul className={styles.subscribeCardFeatures}>
        <li>{dictionary.subscribePage.featureAllArticles}</li>
        <li>{dictionary.subscribePage.featureFiles}</li>
        <li>{dictionary.subscribePage.featureCancelAnytime}</li>
      </ul>

      {isLoggedIn ? (
        <button type="button" className={styles.planButton} disabled={disabled} onClick={onSubscribe}>
          {dictionary.subscribePage.subscribeButton}
        </button>
      ) : (
        <Link href={`/${locale}/login`} className={styles.planButton}>
          {dictionary.subscribePage.loginToSubscribe}
        </Link>
      )}
    </div>
  );
}
