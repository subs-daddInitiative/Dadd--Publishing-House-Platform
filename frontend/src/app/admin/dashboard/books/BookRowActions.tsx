"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./books.module.css";

type BookRowActionsProps = {
  id: number;
};

export function BookRowActions({ id }: BookRowActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm("هل تريد حذف هذا الكتاب؟")) return;
    await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.actions}>
      <Link href={`/admin/dashboard/books/${id}/edit`} className={styles.buttonSecondary}>
        تعديل
      </Link>
      <button type="button" className={styles.buttonDanger} onClick={handleDelete}>
        حذف
      </button>
    </div>
  );
}
