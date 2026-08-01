"use client";

import { useRouter } from "next/navigation";
import styles from "./contact-messages.module.css";

type MessageActionsProps = {
  id: number;
  isRead: boolean;
};

export function MessageActions({ id, isRead }: MessageActionsProps) {
  const router = useRouter();

  async function handleMarkRead() {
    await fetch(`/api/admin/contact-messages/${id}/read`, { method: "PATCH" });
    router.refresh();
  }

  async function handleDelete() {
    await fetch(`/api/admin/contact-messages/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.actions}>
      {!isRead && (
        <button type="button" className={styles.button} onClick={handleMarkRead}>
          تحديد كمقروءة
        </button>
      )}
      <button type="button" className={styles.buttonDanger} onClick={handleDelete}>
        حذف
      </button>
    </div>
  );
}
