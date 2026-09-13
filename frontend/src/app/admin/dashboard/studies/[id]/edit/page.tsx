import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminStudyById, getAdminStudyTranslations, getPublicStudyCategories, backendAssetUrl } from "@/lib/serverApi";
import { StudyForm } from "../../StudyForm";
import styles from "../../studies.module.css";

export const metadata = { title: "تعديل دراسة" };

const TRANSLATABLE_LOCALES: { locale: "en" | "de"; name: string }[] = [
  { locale: "en", name: "English" },
  { locale: "de", name: "Deutsch" },
];

export default async function EditStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [study, categories, translations] = await Promise.all([
    getAdminStudyById(id),
    getPublicStudyCategories(),
    getAdminStudyTranslations(id),
  ]);

  if (!study) notFound();

  const translatedLocales = new Set(translations.map((t) => t.locale));

  return (
    <section>
      <h1>تعديل دراسة</h1>

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
              <Link href={`/admin/dashboard/studies/${study.id}/translations/${locale}`} className={styles.buttonSecondary}>
                {isDone ? "تعديل الترجمة" : "إضافة ترجمة"}
              </Link>
            </div>
          );
        })}
      </div>

      <StudyForm
        mode="edit"
        studyId={study.id}
        categories={categories}
        initialStudy={study}
        currentCoverImageUrl={backendAssetUrl(study.cover_image)}
        currentPdfUrl={backendAssetUrl(study.pdf_file)}
      />
    </section>
  );
}
