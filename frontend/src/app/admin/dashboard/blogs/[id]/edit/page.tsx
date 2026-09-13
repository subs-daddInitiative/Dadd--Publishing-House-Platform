import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminBlogById,
  getAdminBlogTranslations,
  getPublicBlogCategories,
  getPublicSettings,
  backendAssetUrl,
} from "@/lib/serverApi";
import { BlogForm } from "../../BlogForm";
import styles from "../../blogs.module.css";

export const metadata = { title: "تعديل مقالة" };

const TRANSLATABLE_LOCALES: { locale: "en" | "de"; name: string }[] = [
  { locale: "en", name: "English" },
  { locale: "de", name: "Deutsch" },
];

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [blog, categories, settings, translations] = await Promise.all([
    getAdminBlogById(id),
    getPublicBlogCategories(),
    getPublicSettings(),
    getAdminBlogTranslations(id),
  ]);

  if (!blog) notFound();

  const translatedLocales = new Set(translations.map((t) => t.locale));

  return (
    <section>
      <h1>تعديل مقالة</h1>

      <div className={styles.translationsBox}>
        <h2 className={styles.translationsBoxTitle}>الترجمات</h2>
        {TRANSLATABLE_LOCALES.map(({ locale, name }) => {
          const isDone = translatedLocales.has(locale);
          return (
            <div key={locale} className={styles.translationRow}>
              <span className={styles.translationLocaleName}>{name}</span>
              <span className={isDone ? styles.translationStatusDone : styles.translationStatusMissing}>
                {isDone ? "مُترجمة" : "غير مُترجمة — لن تظهر لزوار هذه اللغة"}
              </span>
              <Link href={`/admin/dashboard/blogs/${blog.id}/translations/${locale}`} className={styles.buttonSecondary}>
                {isDone ? "تعديل الترجمة" : "إضافة ترجمة"}
              </Link>
            </div>
          );
        })}
      </div>

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
