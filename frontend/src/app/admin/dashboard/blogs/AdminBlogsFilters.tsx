"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./blogs.module.css";

export function AdminBlogsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const currentPremium = searchParams.get("premium") || "";
  const currentHighlighted = searchParams.get("highlighted") || "";

  function pushParams(next: URLSearchParams) {
    const query = next.toString();
    router.push(`/admin/dashboard/blogs${query ? `?${query}` : ""}`);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    pushParams(params);
  }

  function handlePremiumChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("premium", value);
    } else {
      params.delete("premium");
    }
    pushParams(params);
  }

  function handleHighlightedChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("highlighted", value);
    } else {
      params.delete("highlighted");
    }
    pushParams(params);
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
        value={currentPremium}
        onChange={(event) => handlePremiumChange(event.target.value)}
      >
        <option value="">كل المقالات</option>
        <option value="free">مجانية</option>
        <option value="premium">للمشتركين فقط</option>
      </select>

      <select
        className={styles.select}
        value={currentHighlighted}
        onChange={(event) => handleHighlightedChange(event.target.value)}
      >
        <option value="">كل المقالات</option>
        <option value="1">المميزة فقط</option>
      </select>
    </div>
  );
}
