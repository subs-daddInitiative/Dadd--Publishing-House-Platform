import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminContentTrials, getPublicStudyCategories } from "@/lib/serverApi";
import { ContentTrialsManager } from "../ContentTrialsManager";
import styles from "../content-trials.module.css";

export const metadata = { title: "التجارب المجانية للدراسات" };

export default async function StudyContentTrialsPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const [trials, categories] = await Promise.all([
    getAdminContentTrials("studies"),
    getPublicStudyCategories(),
  ]);

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>التجارب المجانية للدراسات</h1>
        <p>أنشئ تجارب مجانية مؤقتة تمنح القرّاء وصولًا لتصنيفات محددة من الدراسات المميزة، لمرة واحدة لكل قارئ.</p>
      </div>
      <ContentTrialsManager contentType="studies" initialTrials={trials} categories={categories} />
    </section>
  );
}
