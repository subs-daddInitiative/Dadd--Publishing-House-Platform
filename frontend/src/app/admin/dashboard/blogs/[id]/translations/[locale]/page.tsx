import { notFound } from "next/navigation";
import { getAdminBlogById, getAdminBlogTranslation } from "@/lib/serverApi";
import { BlogTranslationForm } from "./BlogTranslationForm";
import styles from "../../../blogs.module.css";

const LOCALE_NAMES: Record<string, string> = { en: "English", de: "Deutsch" };

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { locale } = await params;
  return { title: `ترجمة المقالة (${LOCALE_NAMES[locale] || locale})` };
}

export default async function BlogTranslationPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  if (locale !== "en" && locale !== "de") notFound();

  const [blog, translation] = await Promise.all([getAdminBlogById(id), getAdminBlogTranslation(id, locale)]);
  if (!blog) notFound();

  return (
    <section>
      <h1>
        ترجمة المقالة إلى {LOCALE_NAMES[locale]} — <span className={styles.itemMeta}>{blog.title}</span>
      </h1>
      <BlogTranslationForm blogId={blog.id} locale={locale} initialTranslation={translation} />
    </section>
  );
}
