import { notFound } from "next/navigation";
import { getAdminStudyById, getAdminStudyTranslation } from "@/lib/serverApi";
import { StudyTranslationForm } from "./StudyTranslationForm";
import styles from "../../../studies.module.css";

const LOCALE_NAMES: Record<string, string> = { en: "English", de: "Deutsch" };

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { locale } = await params;
  return { title: `ترجمة الدراسة (${LOCALE_NAMES[locale] || locale})` };
}

export default async function StudyTranslationPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  if (locale !== "en" && locale !== "de") notFound();

  const [study, translation] = await Promise.all([getAdminStudyById(id), getAdminStudyTranslation(id, locale)]);
  if (!study) notFound();

  return (
    <section>
      <h1>
        ترجمة الدراسة إلى {LOCALE_NAMES[locale]} — <span className={styles.itemMeta}>{study.title}</span>
      </h1>
      <StudyTranslationForm studyId={study.id} locale={locale} initialTranslation={translation} />
    </section>
  );
}
