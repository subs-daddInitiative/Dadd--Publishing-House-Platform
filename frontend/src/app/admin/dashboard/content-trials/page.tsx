import { redirect } from "next/navigation";
import {
  getCurrentAdmin,
  getAdminContentTrials,
  getPublicBlogCategories,
  getPublicStudyCategories,
} from "@/lib/serverApi";
import { ContentTrialsManager } from "./ContentTrialsManager";
import styles from "./content-trials.module.css";

export const metadata = { title: "التجارب المجانية للمحتوى" };

export default async function ContentTrialsPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const [trials, blogCategories, studyCategories] = await Promise.all([
    getAdminContentTrials(),
    getPublicBlogCategories(),
    getPublicStudyCategories(),
  ]);

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>التجارب المجانية للمحتوى</h1>
        <p>
          أنشئ تجارب مجانية مؤقتة تمنح القرّاء وصولًا لتصنيفات محددة من المدونة أو الدراسات المميزة، لمرة واحدة لكل
          قارئ.
        </p>
      </div>
      <ContentTrialsManager
        initialTrials={trials}
        blogCategories={blogCategories}
        studyCategories={studyCategories}
      />
    </section>
  );
}
