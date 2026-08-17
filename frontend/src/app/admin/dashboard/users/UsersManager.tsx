"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Moderator } from "@/lib/serverApi";
import styles from "./users.module.css";

type UsersManagerProps = {
  moderators: Moderator[];
};

export function UsersManager({ moderators }: UsersManagerProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await response.json();

    if (result.success) {
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } else {
      setErrorMessage(result.message || "فشلت العملية");
    }
    setStatus("idle");
  }

  async function handleDelete(id: number) {
    if (!window.confirm("هل تريد حذف هذا المشرف؟")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      {moderators.length === 0 ? (
        <p className={styles.empty}>لا يوجد مشرفون بعد.</p>
      ) : (
        <ul className={styles.list}>
          {moderators.map((moderator) => (
            <li key={moderator.id} className={styles.item}>
              <div>
                <p className={styles.itemName}>{moderator.name}</p>
                <p className={styles.itemMeta}>{moderator.email}</p>
              </div>
              <button type="button" className={styles.buttonDanger} onClick={() => handleDelete(moderator.id)}>
                حذف
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCreate} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="modName" className={styles.label}>
            الاسم
          </label>
          <input
            id="modName"
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="modEmail" className={styles.label}>
            البريد الإلكتروني
          </label>
          <input
            id="modEmail"
            type="email"
            className={styles.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="modPassword" className={styles.label}>
            كلمة المرور
          </label>
          <input
            id="modPassword"
            type="password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>
        <button type="submit" className={styles.button} disabled={status === "saving"}>
          {status === "saving" ? "جارٍ الإضافة..." : "إضافة مشرف"}
        </button>
        {errorMessage && <p className={styles.statusError}>{errorMessage}</p>}
      </form>
    </div>
  );
}
