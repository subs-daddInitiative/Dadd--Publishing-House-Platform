import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/serverApi";
import { LoginForm } from "./LoginForm";
import styles from "./login.module.css";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin/dashboard");

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>لوحة التحكم</h1>
        <p className={styles.subtitle}>تسجيل دخول المسؤول</p>
        <LoginForm />
      </div>
    </div>
  );
}
