import { notFound } from "next/navigation";
import { getAdminStudyById, getPublicStudyCategories, backendAssetUrl } from "@/lib/serverApi";
import { StudyForm } from "../../StudyForm";

export const metadata = { title: "تعديل دراسة" };

export default async function EditStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [study, categories] = await Promise.all([getAdminStudyById(id), getPublicStudyCategories()]);

  if (!study) notFound();

  return (
    <section>
      <h1>تعديل دراسة</h1>
      <StudyForm
        mode="edit"
        studyId={study.id}
        categories={categories}
        initialStudy={study}
        currentCoverImageUrl={backendAssetUrl(study.cover_image)}
        currentMainImageUrl={backendAssetUrl(study.main_image)}
        currentPdfUrl={backendAssetUrl(study.pdf_file)}
      />
    </section>
  );
}
