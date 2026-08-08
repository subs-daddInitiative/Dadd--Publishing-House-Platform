"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { StudyCategory } from "@/lib/serverApi";
import styles from "./studies.module.css";

type StudiesFiltersProps = {
  locale: Locale;
  categories: StudyCategory[];
  allCategoriesLabel: string;
  sortNewestLabel: string;
  sortOldestLabel: string;
};

export function StudiesFilters({
  locale,
  categories,
  allCategoriesLabel,
  sortNewestLabel,
  sortOldestLabel,
}: StudiesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    router.push(`/${locale}/studies${query ? `?${query}` : ""}`);
  }

  return (
    <div className={styles.filters}>
      <select
        className={styles.filterSelect}
        value={currentCategory}
        onChange={(event) => updateParam("category", event.target.value)}
      >
        <option value="">{allCategoriesLabel}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        className={styles.filterSelect}
        value={currentSort}
        onChange={(event) => updateParam("sort", event.target.value)}
      >
        <option value="newest">{sortNewestLabel}</option>
        <option value="oldest">{sortOldestLabel}</option>
      </select>
    </div>
  );
}
