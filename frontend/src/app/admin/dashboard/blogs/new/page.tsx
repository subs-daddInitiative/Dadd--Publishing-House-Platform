import { getPublicBlogCategories, getPublicSettings } from "@/lib/serverApi";
import { BlogForm } from "../BlogForm";

export const metadata = { title: "إضافة مقالة" };

export default async function NewBlogPage() {
  const [categories, settings] = await Promise.all([getPublicBlogCategories(), getPublicSettings()]);

  return (
    <section>
      <h1>إضافة مقالة</h1>
      <BlogForm mode="create" categories={categories} defaultAuthorName={settings?.siteName} />
    </section>
  );
}
