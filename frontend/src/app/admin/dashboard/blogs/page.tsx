import Link from "next/link";
import { getAdminBlogs, backendAssetUrl } from "@/lib/serverApi";
import { BlogRowActions } from "./BlogRowActions";
import { AdminBlogsFilters } from "./AdminBlogsFilters";
import styles from "./blogs.module.css";

export const metadata = { title: "المدونة" };

const STATUS_LABELS: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
};

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; premium?: string }>;
}) {
  const { search, premium: premiumParam } = await searchParams;
  const premium = premiumParam === "free" || premiumParam === "premium" ? premiumParam : undefined;
  const blogs = await getAdminBlogs({ search, premium });

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>المدونة</h1>
        <div className={styles.actions}>
          <Link href="/admin/dashboard/blogs/categories" className={styles.buttonSecondary}>
            إدارة التصنيفات
          </Link>
          <Link href="/admin/dashboard/blogs/new" className={styles.button}>
            إضافة مقالة
          </Link>
        </div>
      </div>

      <AdminBlogsFilters />

      {blogs.length === 0 ? (
        <p className={styles.empty}>لا توجد مقالات بعد.</p>
      ) : (
        <ul className={styles.list}>
          {blogs.map((blog) => {
            const coverImageUrl = backendAssetUrl(blog.cover_image);
            return (
              <li key={blog.id} className={styles.item}>
                {coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImageUrl} alt={blog.title} className={styles.thumbnail} />
                ) : (
                  <div className={styles.thumbnailFallback} aria-hidden="true">
                    {blog.title.charAt(0)}
                  </div>
                )}

                <div className={styles.itemBody}>
                  <p className={styles.itemTitle}>{blog.title}</p>
                  <p className={styles.itemMeta}>
                    {blog.category_name || "بدون تصنيف"}
                    {" · "}
                    <span
                      className={
                        blog.status === "published" ? styles.statusBadgePublished : styles.statusBadgeDraft
                      }
                    >
                      {STATUS_LABELS[blog.status]}
                    </span>
                    {" · "}
                    <span className={blog.is_premium ? styles.premiumBadge : styles.freeBadge}>
                      {blog.is_premium ? "للمشتركين فقط" : "مجانية"}
                    </span>
                    {" · "}
                    {blog.published_at || blog.updated_at}
                  </p>
                </div>

                <BlogRowActions id={blog.id} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
