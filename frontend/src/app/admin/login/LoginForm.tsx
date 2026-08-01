"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!result.success) {
        setError(result.message || "فشل تسجيل الدخول");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className={styles.input}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          className={styles.input}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "جارٍ الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
