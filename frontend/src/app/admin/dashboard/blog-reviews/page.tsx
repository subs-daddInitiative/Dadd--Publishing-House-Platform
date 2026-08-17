import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin, getPendingReviewBlogs } from "@/lib/serverApi";
import styles from "../writer-requests/writer-requests.module.css";

export const metadata = { title: "مراجعة مقالات الكُتّاب" };

export default async function BlogReviewsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const pending = await getPendingReviewBlogs();

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>مراجعة مقالات الكُتّاب</h1>
        <p>مقالات أرسلها الكُتّاب بانتظار الموافقة أو الرفض.</p>
      </div>

      {pending.length === 0 ? (
        <p className={styles.empty}>لا توجد مقالات بانتظار المراجعة.</p>
      ) : (
        <ul className={styles.list}>
          {pending.map((blog) => (
            <li key={blog.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <p className={styles.itemName}>{blog.title}</p>
                <p className={styles.itemMeta}>
                  {blog.writer_name} - {blog.writer_email}
                </p>
                {blog.category_name && <p className={styles.itemMeta}>{blog.category_name}</p>}
              </div>
              <Link href={`/admin/dashboard/blog-reviews/${blog.id}`} className={styles.buttonAccept}>
                مراجعة
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
