import { notFound } from "next/navigation";
import { getAdminBlogById, getPublicBlogCategories, getPublicSettings, backendAssetUrl } from "@/lib/serverApi";
import { BlogForm } from "../../BlogForm";

export const metadata = { title: "تعديل مقالة" };

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [blog, categories, settings] = await Promise.all([
    getAdminBlogById(id),
    getPublicBlogCategories(),
    getPublicSettings(),
  ]);

  if (!blog) notFound();

  return (
    <section>
      <h1>تعديل مقالة</h1>
      <BlogForm
        mode="edit"
        blogId={blog.id}
        categories={categories}
        initialBlog={blog}
        currentCoverImageUrl={backendAssetUrl(blog.cover_image)}
        defaultAuthorName={settings?.siteName}
      />
    </section>
  );
}
