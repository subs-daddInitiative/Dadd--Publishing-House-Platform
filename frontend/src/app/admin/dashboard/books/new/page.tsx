import { getPublicBookCategories } from "@/lib/serverApi";
import { BookForm } from "../BookForm";

export const metadata = { title: "إضافة كتاب" };

export default async function NewBookPage() {
  const categories = await getPublicBookCategories();

  return (
    <section>
      <h1>إضافة كتاب</h1>
      <BookForm mode="create" categories={categories} />
    </section>
  );
}
