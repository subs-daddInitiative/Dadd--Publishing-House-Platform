"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./contact-messages.module.css";

const SUBJECTS = [
  { value: "", label: "كل المواضيع" },
  { value: "books", label: "الكتب" },
  { value: "studies", label: "الدراسات" },
  { value: "blogs", label: "المدونة" },
  { value: "issues", label: "مشكلة أو استفسار عام" },
];

export function SubjectFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSubject = searchParams.get("subject") || "";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("subject", value);
    } else {
      params.delete("subject");
    }
    const query = params.toString();
    router.push(`/admin/dashboard/contact-messages${query ? `?${query}` : ""}`);
  }

  return (
    <select
      className={styles.filterSelect}
      value={currentSubject}
      onChange={(event) => handleChange(event.target.value)}
    >
      {SUBJECTS.map((subject) => (
        <option key={subject.value} value={subject.value}>
          {subject.label}
        </option>
      ))}
    </select>
  );
}
