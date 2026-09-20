import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminContentTrials, getPublicBlogCategories } from "@/lib/serverApi";
import { ContentTrialsManager } from "../ContentTrialsManager";
import styles from "../content-trials.module.css";

export const metadata = { title: "التجارب المجانية للمدونة" };

export default async function BlogContentTrialsPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const [trials, categories] = await Promise.all([
    getAdminContentTrials("blogs"),
    getPublicBlogCategories(),
  ]);

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>التجارب المجانية للمدونة</h1>
        <p>أنشئ تجارب مجانية مؤقتة تمنح القرّاء وصولًا لتصنيفات محددة من مقالات المدونة المميزة، لمرة واحدة لكل قارئ.</p>
      </div>
      <ContentTrialsManager contentType="blogs" initialTrials={trials} categories={categories} />
    </section>
  );
}
