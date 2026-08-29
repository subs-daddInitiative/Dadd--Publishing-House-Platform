import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminNewsTicker } from "@/lib/serverApi";
import { NewsTickerManager } from "./NewsTickerManager";
import styles from "./news-ticker.module.css";

export const metadata = { title: "الشريط الإخباري" };

export default async function NewsTickerPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const items = await getAdminNewsTicker();

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>الشريط الإخباري المتحرك</h1>
        <p>
          رسائل تظهر في شريط متحرك أعلى الموقع. يمكن أن تكون موجّهة للجميع، أو للقراء فقط، أو للكُتّاب فقط.
        </p>
      </div>
      <NewsTickerManager initialItems={items} />
    </section>
  );
}
