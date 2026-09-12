"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./studies.module.css";

export function AdminStudiesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentHighlighted = searchParams.get("highlighted") || "";

  function handleHighlightedChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("highlighted", value);
    } else {
      params.delete("highlighted");
    }
    const query = params.toString();
    router.push(`/admin/dashboard/studies${query ? `?${query}` : ""}`);
  }

  return (
    <div className={styles.filtersRow}>
      <select
        className={styles.select}
        value={currentHighlighted}
        onChange={(event) => handleHighlightedChange(event.target.value)}
      >
        <option value="">كل الدراسات</option>
        <option value="1">المميزة فقط</option>
      </select>
    </div>
  );
}
