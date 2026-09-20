import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminWriterTrialSettings } from "@/lib/serverApi";
import { WriterTrialForm } from "./WriterTrialForm";
import styles from "./writer-trial.module.css";

export const metadata = { title: "تجربة الكُتّاب المجانية" };

export default async function WriterTrialPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const settings = await getAdminWriterTrialSettings();

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>تجربة الكُتّاب المجانية</h1>
        <p>
          عند التسجيل، يحصل حساب الكاتب الجديد على تجربة مجانية لمستوى &quot;كاتب مبتدئ&quot; لمرة واحدة فقط. يمكنك
          هنا تفعيل/إيقاف هذه الميزة وتحديد مدتها.
        </p>
      </div>
      <WriterTrialForm
        initialSettings={
          settings || { is_enabled: false, duration_value: 1, duration_unit: "month" }
        }
      />
    </section>
  );
}
