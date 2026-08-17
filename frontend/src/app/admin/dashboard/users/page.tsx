import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminModerators } from "@/lib/serverApi";
import { UsersManager } from "./UsersManager";
import styles from "./users.module.css";

export const metadata = { title: "المستخدمون" };

export default async function UsersPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const moderators = await getAdminModerators();

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>المستخدمون</h1>
        <p>يمكنك إضافة مشرفين للمساعدة في إدارة المدونة والدراسات والكتب.</p>
      </div>
      <UsersManager moderators={moderators} />
    </section>
  );
}
