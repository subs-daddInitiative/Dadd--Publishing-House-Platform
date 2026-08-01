"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./blogs.module.css";

type BlogRowActionsProps = {
  id: number;
};

export function BlogRowActions({ id }: BlogRowActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm("هل تريد حذف هذه المقالة؟")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.actions}>
      <Link href={`/admin/dashboard/blogs/${id}/edit`} className={styles.buttonSecondary}>
        تعديل
      </Link>
      <button type="button" className={styles.buttonDanger} onClick={handleDelete}>
        حذف
      </button>
    </div>
  );
}
