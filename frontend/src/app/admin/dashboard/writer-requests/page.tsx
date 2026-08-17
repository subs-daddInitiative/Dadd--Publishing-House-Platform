import { redirect } from "next/navigation";
import { getCurrentAdmin, getPendingWriterUpgradeRequests } from "@/lib/serverApi";
import { WriterRequestsManager } from "./WriterRequestsManager";
import styles from "./writer-requests.module.css";

export const metadata = { title: "طلبات التوثيق" };

export default async function WriterRequestsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const requests = await getPendingWriterUpgradeRequests();

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>طلبات التوثيق</h1>
        <p>طلبات الكُتّاب المبتدئين للترقية إلى كاتب موثق.</p>
      </div>
      <WriterRequestsManager requests={requests} />
    </section>
  );
}
