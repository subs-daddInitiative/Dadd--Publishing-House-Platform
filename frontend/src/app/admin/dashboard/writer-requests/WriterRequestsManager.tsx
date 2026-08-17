"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WriterUpgradeRequest } from "@/lib/serverApi";
import styles from "./writer-requests.module.css";

type WriterRequestsManagerProps = {
  requests: WriterUpgradeRequest[];
};

export function WriterRequestsManager({ requests }: WriterRequestsManagerProps) {
  const router = useRouter();
  const [reasonById, setReasonById] = useState<Record<number, string>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function decide(id: number, decision: "invited" | "rejected") {
    const reason = reasonById[id]?.trim() || "";
    if (decision === "rejected" && !reason) {
      window.alert("يجب كتابة سبب الرفض");
      return;
    }

    setPendingId(id);
    await fetch(`/api/admin/writer-upgrade-requests/${id}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, reason }),
    });
    setPendingId(null);
    router.refresh();
  }

  if (requests.length === 0) {
    return <p className={styles.empty}>لا توجد طلبات معلّقة حاليًا.</p>;
  }

  return (
    <ul className={styles.list}>
      {requests.map((request) => (
        <li key={request.id} className={styles.item}>
          <div className={styles.itemHeader}>
            <p className={styles.itemName}>{request.name}</p>
            <p className={styles.itemMeta}>{request.email}</p>
          </div>
          <textarea
            className={styles.textarea}
            placeholder="سبب الرفض (مطلوب فقط عند الرفض)"
            value={reasonById[request.id] || ""}
            onChange={(event) =>
              setReasonById((prev) => ({ ...prev, [request.id]: event.target.value }))
            }
          />
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.buttonAccept}
              disabled={pendingId === request.id}
              onClick={() => decide(request.id, "invited")}
            >
              دعوة للتوثيق
            </button>
            <button
              type="button"
              className={styles.buttonReject}
              disabled={pendingId === request.id}
              onClick={() => decide(request.id, "rejected")}
            >
              رفض
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
