import Link from "next/link";
import {
  getAdminStudies,
  getAdminHighlightedStudiesCount,
  getPublicStudyCategories,
  backendAssetUrl,
} from "@/lib/serverApi";
import { StudyRowActions } from "./StudyRowActions";
import { AdminStudiesFilters } from "./AdminStudiesFilters";
import styles from "./studies.module.css";

export const metadata = { title: "الدراسات" };

const STATUS_LABELS: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
};

export default async function AdminStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    premium?: string;
    highlighted?: string;
    category?: string;
    status?: string;
  }>;
}) {
  const {
    search,
    premium: premiumParam,
    highlighted: highlightedParam,
    category,
    status: statusParam,
  } = await searchParams;
  const premium = premiumParam === "free" || premiumParam === "premium" ? premiumParam : undefined;
  const highlighted = highlightedParam === "1" ? "1" : undefined;
  const status = statusParam === "draft" || statusParam === "published" ? statusParam : undefined;
  const [studies, highlightedCount, categories] = await Promise.all([
    getAdminStudies({ search, premium, highlighted, category, status }),
    getAdminHighlightedStudiesCount(),
    getPublicStudyCategories(),
  ]);

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>الدراسات</h1>
        <div className={styles.actions}>
          <span className={styles.headerStat}>
            <strong>{highlightedCount}</strong> مميزة حاليًا
          </span>
          <Link href="/admin/dashboard/studies/categories" className={styles.buttonSecondary}>
            إدارة التصنيفات
          </Link>
          <Link href="/admin/dashboard/studies/new" className={styles.button}>
            إضافة دراسة
          </Link>
        </div>
      </div>

      <AdminStudiesFilters categories={categories} />

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
                    <span className={study.is_premium ? styles.premiumBadge : styles.freeBadge}>
                      {study.is_premium ? "للمشتركين فقط" : "مجانية"}
                    </span>
                    {Boolean(study.is_highlighted_active) && (
                      <>
                        {" · "}
                        <span className={styles.highlightBadge}>
                          ⭐ مميزة{study.highlighted_until ? ` حتى ${study.highlighted_until}` : ""}
                        </span>
                      </>
                    )}
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
