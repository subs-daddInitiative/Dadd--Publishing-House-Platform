"use client";

import { useRouter } from "next/navigation";
import styles from "./layout.module.css";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      تسجيل الخروج
    </button>
  );
}
