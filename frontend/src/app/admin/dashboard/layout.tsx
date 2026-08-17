import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin, getUnreadContactCount } from "@/lib/serverApi";
import { LogoutButton } from "./LogoutButton";
import styles from "./layout.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const isAdmin = admin.role === "admin";
  const unreadCount = isAdmin ? await getUnreadContactCount() : 0;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>لوحة التحكم</div>
        <ul className={styles.nav}>
          <li>
            <Link href="/admin/dashboard" className={styles.navLink}>
              نظرة عامة
            </Link>
          </li>
          <li>
            <Link href="/admin/dashboard/books" className={styles.navLink}>
              الكتب
            </Link>
          </li>
          <li>
            <Link href="/admin/dashboard/studies" className={styles.navLink}>
              الدراسات
            </Link>
          </li>
          <li>
            <Link href="/admin/dashboard/blogs" className={styles.navLink}>
              المدونة
            </Link>
          </li>
          <li>
            <Link href="/admin/dashboard/blog-reviews" className={styles.navLink}>
              مراجعة مقالات الكُتّاب
            </Link>
          </li>
          <li>
            <Link href="/admin/dashboard/writer-requests" className={styles.navLink}>
              طلبات التوثيق
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link href="/admin/dashboard/contact-messages" className={styles.navLink}>
                  رسائل التواصل
                  {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard/settings" className={styles.navLink}>
                  الإعدادات
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard/users" className={styles.navLink}>
                  المستخدمون
                </Link>
              </li>
            </>
          )}
        </ul>
        <LogoutButton />
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
