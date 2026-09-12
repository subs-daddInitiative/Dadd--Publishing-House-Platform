"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { BlogCategory } from "@/lib/serverApi";
import styles from "./blog.module.css";

type BlogsFiltersProps = {
  locale: Locale;
  categories: BlogCategory[];
  allLabel: string;
  freeLabel: string;
  premiumLabel: string;
  allCategoriesLabel: string;
  sortNewestLabel: string;
  sortOldestLabel: string;
  searchPlaceholder: string;
  searchButtonLabel: string;
  resetLabel: string;
};

export function BlogsFilters({
  locale,
  categories,
  allLabel,
  freeLabel,
  premiumLabel,
  allCategoriesLabel,
  sortNewestLabel,
  sortOldestLabel,
  searchPlaceholder,
  searchButtonLabel,
  resetLabel,
}: BlogsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPremium = searchParams.get("premium") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const hasActiveFilters = Boolean(currentPremium || currentCategory || (currentSort && currentSort !== "newest") || search);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    router.push(`/${locale}/blog${query ? `?${query}` : ""}`);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParam("search", search.trim());
  }

  function handleReset() {
    setSearch("");
    router.push(`/${locale}/blog`);
  }

  return (
    <div className={styles.filters}>
      <form onSubmit={handleSearchSubmit} className={styles.filterSearchForm}>
        <input
          type="search"
          className={styles.filterSearchInput}
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" className={styles.filterSelect}>
          {searchButtonLabel}
        </button>
      </form>

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

      <select className={styles.filterSelect} value={currentPremium} onChange={(event) => updateParam("premium", event.target.value)}>
        <option value="">{allLabel}</option>
        <option value="free">{freeLabel}</option>
        <option value="premium">{premiumLabel}</option>
      </select>

      <select
        className={styles.filterSelect}
        value={currentSort}
        onChange={(event) => updateParam("sort", event.target.value)}
      >
        <option value="newest">{sortNewestLabel}</option>
        <option value="oldest">{sortOldestLabel}</option>
      </select>

      {hasActiveFilters && (
        <button type="button" onClick={handleReset} className={styles.filterResetLink}>
          {resetLabel}
        </button>
      )}
    </div>
  );
}
