"use client";

import { useRouter } from "next/navigation";
import styles from "./contact-messages.module.css";

type JoinRequestActionsProps = {
  id: number;
  isRead: boolean;
};

export function JoinRequestActions({ id, isRead }: JoinRequestActionsProps) {
  const router = useRouter();

  async function handleMarkRead() {
    await fetch(`/api/admin/join-requests/${id}/read`, { method: "PATCH" });
    router.refresh();
  }

  async function handleDelete() {
    await fetch(`/api/admin/join-requests/${id}`, { method: "DELETE" });
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
