"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./studies.module.css";

type StudyRowActionsProps = {
  id: number;
};

export function StudyRowActions({ id }: StudyRowActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm("هل تريد حذف هذه الدراسة؟")) return;
    await fetch(`/api/admin/studies/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.actions}>
      <Link href={`/admin/dashboard/studies/${id}/edit`} className={styles.buttonSecondary}>
        تعديل
      </Link>
      <button type="button" className={styles.buttonDanger} onClick={handleDelete}>
        حذف
      </button>
    </div>
  );
}
