"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import styles from "./blog.module.css";

type BlogsFiltersProps = {
  locale: Locale;
  allLabel: string;
  freeLabel: string;
  premiumLabel: string;
};

export function BlogsFilters({ locale, allLabel, freeLabel, premiumLabel }: BlogsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPremium = searchParams.get("premium") || "";

  function updatePremium(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("premium", value);
    } else {
      params.delete("premium");
    }
    params.delete("page");
    const query = params.toString();
    router.push(`/${locale}/blog${query ? `?${query}` : ""}`);
  }

  return (
    <div className={styles.filters}>
      <select className={styles.filterSelect} value={currentPremium} onChange={(event) => updatePremium(event.target.value)}>
        <option value="">{allLabel}</option>
        <option value="free">{freeLabel}</option>
        <option value="premium">{premiumLabel}</option>
      </select>
    </div>
  );
}
