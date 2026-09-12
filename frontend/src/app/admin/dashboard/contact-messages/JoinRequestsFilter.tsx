"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./contact-messages.module.css";

const REQUEST_TYPES = [
  { value: "", label: "كل الأنواع" },
  { value: "volunteer", label: "طلب انضمام كمتطوع" },
  { value: "complaint", label: "شكوى" },
  { value: "suggestion", label: "اقتراح" },
];

const STATUSES = [
  { value: "", label: "كل الحالات" },
  { value: "unread", label: "غير مقروءة" },
  { value: "read", label: "مقروءة" },
];

export function JoinRequestsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("request_type") || "";
  const currentStatus = searchParams.get("request_status") || "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.push(`/admin/dashboard/contact-messages${query ? `?${query}` : ""}`);
  }

  return (
    <div className={styles.filtersRow}>
      <select
        className={styles.filterSelect}
        value={currentType}
        onChange={(event) => updateParam("request_type", event.target.value)}
      >
        {REQUEST_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <select
        className={styles.filterSelect}
        value={currentStatus}
        onChange={(event) => updateParam("request_status", event.target.value)}
      >
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
}
