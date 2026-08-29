import { notFound } from "next/navigation";
import {
  getAdminBookById,
  getPublicBookCategories,
  getAdminBookPricingTiers,
  backendAssetUrl,
} from "@/lib/serverApi";
import { BookForm } from "../../BookForm";

export const metadata = { title: "تعديل كتاب" };

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
