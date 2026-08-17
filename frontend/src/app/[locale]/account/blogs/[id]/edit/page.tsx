import { isLocale, type Locale } from "@/i18n/config";
import { getCurrentSubscriber, getPublicBlogCategories, getWriterBlogById, backendAssetUrl } from "@/lib/serverApi";
import { WriterBlogForm } from "@/features/blogEditor/WriterBlogForm";
import { notFound, redirect } from "next/navigation";

export default async function EditWriterBlogPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const subscriber = await getCurrentSubscriber();
  if (!subscriber) redirect(`/${locale}/login`);
  if (subscriber.account_type !== "writer") redirect(`/${locale}/account`);

  const [categories, blog] = await Promise.all([getPublicBlogCategories(), getWriterBlogById(id)]);
  if (!blog) notFound();
  if (blog.review_status === "approved") redirect(`/${locale}/account/blogs`);

  return (
    <WriterBlogForm
      locale={locale}
      mode="edit"
      blogId={blog.id}
      categories={categories}
      initialBlog={blog}
      currentCoverImageUrl={backendAssetUrl(blog.cover_image)}
    />
  );
}
