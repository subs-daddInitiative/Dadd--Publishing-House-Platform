import { getPublicStudyCategories } from "@/lib/serverApi";
import { CategoryManager } from "@/components/CategoryManager";

export const metadata = { title: "تصنيفات الدراسات" };

export default async function StudyCategoriesPage() {
  const categories = await getPublicStudyCategories();

  return (
    <section>
      <h1>تصنيفات الدراسات</h1>
      <CategoryManager
        apiBase="/api/admin/studies-categories"
        categories={categories}
        deleteConfirmText="هل تريد حذف هذا التصنيف؟"
      />
    </section>
  );
}
