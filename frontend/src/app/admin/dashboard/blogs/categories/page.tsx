import { getPublicBlogCategories } from "@/lib/serverApi";
import { CategoryManager } from "@/components/CategoryManager";

export const metadata = { title: "تصنيفات المدونة" };

export default async function BlogCategoriesPage() {
  const categories = await getPublicBlogCategories();

  return (
    <section>
      <h1>تصنيفات المدونة</h1>
      <CategoryManager
        apiBase="/api/admin/blogs-categories"
        categories={categories}
        deleteConfirmText="هل تريد حذف هذا التصنيف؟"
      />
    </section>
  );
}
