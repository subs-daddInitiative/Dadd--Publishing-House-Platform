import Link from "next/link";
import { getAdminBooks, backendAssetUrl } from "@/lib/serverApi";
import { formatCurrency } from "@/lib/currency";
import { BookRowActions } from "./BookRowActions";
import styles from "./books.module.css";

export const metadata = { title: "الكتب" };

const STATUS_LABELS: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
};

export default async function AdminBooksPage() {
  const books = await getAdminBooks();

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>الكتب</h1>
        <div className={styles.actions}>
          <Link href="/admin/dashboard/books/categories" className={styles.buttonSecondary}>
            إدارة التصنيفات
          </Link>
          <Link href="/admin/dashboard/books/new" className={styles.button}>
            إضافة كتاب
          </Link>
        </div>
      </div>

      {books.length === 0 ? (
        <p className={styles.empty}>لا توجد كتب بعد.</p>
      ) : (
        <ul className={styles.list}>
          {books.map((book) => {
            const coverImageUrl = backendAssetUrl(book.cover_image);
            return (
              <li key={book.id} className={styles.item}>
                {coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImageUrl} alt={book.title} className={styles.thumbnail} />
                ) : (
                  <div className={styles.thumbnailFallback} aria-hidden="true">
                    {book.title.charAt(0)}
                  </div>
                )}

                <div className={styles.itemBody}>
                  <p className={styles.itemTitle}>{book.title}</p>
                  <p className={styles.itemMeta}>
                    {book.category_name || "بدون تصنيف"}
                    {" · "}
                    {book.price ? formatCurrency(Number(book.price), book.currency) : "بدون سعر"}
                    {book.pricing_tier_name && ` (باقة ${book.pricing_tier_name})`}
                    {" · "}
                    <span
                      className={
                        book.status === "published" ? styles.statusBadgePublished : styles.statusBadgeDraft
                      }
                    >
                      {STATUS_LABELS[book.status]}
                    </span>
                    {" · "}
                    {book.published_at || book.updated_at}
                  </p>
                </div>

                <BookRowActions id={book.id} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
