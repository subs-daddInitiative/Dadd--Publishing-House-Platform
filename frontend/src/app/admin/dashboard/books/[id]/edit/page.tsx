import { notFound } from "next/navigation";
import {
  getAdminBookById,
  getPublicBookCategories,
  getAdminBookPricingTiers,
  backendAssetUrl,
} from "@/lib/serverApi";
import { BookForm } from "../../BookForm";
import { TranslationsPanel } from "@/components/admin/TranslationsPanel";
import styles from "../../books.module.css";

export const metadata = { title: "تعديل كتاب" };

const TRANSLATION_FIELDS = [
  { key: "title", label: "العنوان (اتركه فارغًا لعرض العنوان العربي)" },
  { key: "author", label: "اسم المؤلف (اتركه فارغًا لعرض الاسم العربي)" },
  { key: "description", label: "الوصف (اتركه فارغًا لعرض الوصف العربي)", multiline: true },
];

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [book, categories, tiers] = await Promise.all([
    getAdminBookById(id),
    getPublicBookCategories(),
    getAdminBookPricingTiers(),
  ]);

  if (!book) notFound();

  return (
    <section>
      <h1>تعديل كتاب</h1>

      <div className={styles.translationsBox}>
        <h2 className={styles.translationsBoxTitle}>الترجمات</h2>
        <p className={styles.translationsBoxHint}>
          هذا كتاب عربي بالأساس — أي حقل تتركه فارغًا هنا يظهر بالعربية تلقائيًا لزوار اللغتين الأخريين.
        </p>
        <div className={styles.translationsBoxBody}>
          <TranslationsPanel apiBase={`/api/admin/books/${book.id}`} fields={TRANSLATION_FIELDS} />
        </div>
      </div>

      <BookForm
        mode="edit"
        bookId={book.id}
        categories={categories}
        tiers={tiers}
        initialBook={book}
        currentCoverImageUrl={backendAssetUrl(book.cover_image)}
        currentPdfUrl={backendAssetUrl(book.pdf_file)}
      />
    </section>
  );
}
