import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminBookPricingTiers } from "@/lib/serverApi";
import { BookPricingTiersForm } from "../../settings/BookPricingTiersForm";

export const metadata = { title: "باقات تسعير الكتب" };

export default async function BookPricingTiersPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const tiers = await getAdminBookPricingTiers();

  return (
    <section>
      <h1>باقات تسعير الكتب</h1>
      <BookPricingTiersForm initialTiers={tiers} />
    </section>
  );
}
