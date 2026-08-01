import Link from "next/link";
import { getCurrentAdmin, getUnreadContactCount } from "@/lib/serverApi";
import styles from "./overview.module.css";

export const metadata = { title: "نظرة عامة" };
export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const [admin, unreadCount] = await Promise.all([getCurrentAdmin(), getUnreadContactCount()]);

  return (
    <section>
      <h1>نظرة عامة</h1>
      <p>مرحبًا {admin?.name}، هذه لوحة تحكم دار النشر.</p>

      {unreadCount > 0 && (
        <div className={styles.notice}>
          <p className={styles.noticeText}>
            لديك {unreadCount} {unreadCount === 1 ? "رسالة تواصل جديدة" : "رسائل تواصل جديدة"}
          </p>
          <Link href="/admin/dashboard/contact-messages" className={styles.noticeLink}>
            عرض الرسائل
          </Link>
        </div>
      )}
    </section>
  );
}
