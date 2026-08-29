import { getPublicBookCategories, getAdminBookPricingTiers } from "@/lib/serverApi";
import { BookForm } from "../BookForm";

export const metadata = { title: "إضافة كتاب" };

export default async function NewBookPage() {
  const [categories, tiers] = await Promise.all([getPublicBookCategories(), getAdminBookPricingTiers()]);

  return (
    <section>
      <h1>إضافة كتاب</h1>
      <BookForm mode="create" categories={categories} tiers={tiers} />
    </section>
  );
}
