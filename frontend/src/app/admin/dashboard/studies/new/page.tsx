import { getPublicStudyCategories } from "@/lib/serverApi";
import { StudyForm } from "../StudyForm";

export const metadata = { title: "إضافة دراسة" };

export default async function NewStudyPage() {
  const categories = await getPublicStudyCategories();

  return (
    <section>
      <h1>إضافة دراسة</h1>
      <StudyForm mode="create" categories={categories} />
    </section>
  );
}
