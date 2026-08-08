import { getPublicBookCategories } from "@/lib/serverApi";
import { CategoryManager } from "@/components/CategoryManager";

export const metadata = { title: "تصنيفات الكتب" };

export default async function BookCategoriesPage() {
  const categories = await getPublicBookCategories();

  return (
    <section>
      <h1>تصنيفات الكتب</h1>
      <CategoryManager
        apiBase="/api/admin/books-categories"
        categories={categories}
        deleteConfirmText="هل تريد حذف هذا التصنيف؟"
      />
    </section>
  );
}
