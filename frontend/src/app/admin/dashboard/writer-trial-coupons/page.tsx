import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminWriterTrialCoupons } from "@/lib/serverApi";
import { WriterTrialCouponsManager } from "./WriterTrialCouponsManager";
import styles from "./writer-trial-coupons.module.css";

export const metadata = { title: "أكواد التجربة المجانية" };

export default async function WriterTrialCouponsPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const coupons = await getAdminWriterTrialCoupons();

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>أكواد التجربة المجانية للكُتّاب</h1>
        <p>
          أنشئ كودًا يمنح كاتبًا بدون باقة تجربة مجانية لعدد أشهر محدد كـ &quot;كاتب مبتدئ&quot;، ليتمكن من كتابة
          المقالات وإرسالها للمراجعة.
        </p>
      </div>
      <WriterTrialCouponsManager initialCoupons={coupons} />
    </section>
  );
}
