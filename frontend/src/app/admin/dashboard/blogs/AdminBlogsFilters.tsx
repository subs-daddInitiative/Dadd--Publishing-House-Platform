"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BlogCategory } from "@/lib/serverApi";
import styles from "./blogs.module.css";

type AdminBlogsFiltersProps = {
  categories: BlogCategory[];
};

export function AdminBlogsFilters({ categories }: AdminBlogsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const currentPremium = searchParams.get("premium") || "";
  const currentHighlighted = searchParams.get("highlighted") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentStatus = searchParams.get("status") || "";

  const hasActiveFilters = Boolean(
    search || currentPremium || currentHighlighted || currentCategory || currentStatus
  );

  function pushParams(next: URLSearchParams) {
    const query = next.toString();
    router.push(`/admin/dashboard/blogs${query ? `?${query}` : ""}`);
  }

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    pushParams(params);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParam("search", search.trim());
  }

  function handleReset() {
    setSearch("");
    router.push("/admin/dashboard/blogs");
  }

  return (
    <div className={styles.filtersRow}>
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="search"
          className={styles.input}
          placeholder="ابحث بالعنوان..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" className={styles.buttonSecondary}>
          بحث
        </button>
      </form>

      <select
        className={styles.select}
        value={currentCategory}
        onChange={(event) => updateParam("category", event.target.value)}
      >
        <option value="">كل التصنيفات</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={currentStatus}
        onChange={(event) => updateParam("status", event.target.value)}
      >
        <option value="">كل الحالات</option>
        <option value="draft">مسودة</option>
        <option value="published">منشور</option>
      </select>

      <select
        className={styles.select}
        value={currentPremium}
        onChange={(event) => updateParam("premium", event.target.value)}
      >
        <option value="">كل المقالات</option>
        <option value="free">مجانية</option>
        <option value="premium">للمشتركين فقط</option>
      </select>

      <select
        className={styles.select}
        value={currentHighlighted}
        onChange={(event) => updateParam("highlighted", event.target.value)}
      >
        <option value="">كل المقالات</option>
        <option value="1">المميزة فقط</option>
      </select>

      {hasActiveFilters && (
        <button type="button" onClick={handleReset} className={styles.buttonSecondary}>
          إعادة تعيين
        </button>
      )}
    </div>
  );
}
