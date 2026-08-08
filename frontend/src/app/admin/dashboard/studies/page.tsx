import Link from "next/link";
import { getAdminStudies, backendAssetUrl } from "@/lib/serverApi";
import { StudyRowActions } from "./StudyRowActions";
import styles from "./studies.module.css";

export const metadata = { title: "الدراسات" };

const STATUS_LABELS: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
};

export default async function AdminStudiesPage() {
  const studies = await getAdminStudies();

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>الدراسات</h1>
        <div className={styles.actions}>
          <Link href="/admin/dashboard/studies/categories" className={styles.buttonSecondary}>
            إدارة التصنيفات
          </Link>
          <Link href="/admin/dashboard/studies/new" className={styles.button}>
            إضافة دراسة
          </Link>
        </div>
      </div>

      {studies.length === 0 ? (
        <p className={styles.empty}>لا توجد دراسات بعد.</p>
      ) : (
        <ul className={styles.list}>
          {studies.map((study) => {
            const coverImageUrl = backendAssetUrl(study.cover_image);
            return (
              <li key={study.id} className={styles.item}>
                {coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImageUrl} alt={study.title} className={styles.thumbnail} />
                ) : (
                  <div className={styles.thumbnailFallback} aria-hidden="true">
                    {study.title.charAt(0)}
                  </div>
                )}

                <div className={styles.itemBody}>
                  <p className={styles.itemTitle}>{study.title}</p>
                  <p className={styles.itemMeta}>
                    {study.category_name || "بدون تصنيف"}
                    {" · "}
                    <span
                      className={
                        study.status === "published" ? styles.statusBadgePublished : styles.statusBadgeDraft
                      }
                    >
                      {STATUS_LABELS[study.status]}
                    </span>
                    {" · "}
                    {study.published_at || study.updated_at}
                  </p>
                </div>

                <StudyRowActions id={study.id} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
