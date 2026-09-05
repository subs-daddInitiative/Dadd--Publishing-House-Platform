import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminSiteAds, backendAssetUrl } from "@/lib/serverApi";
import { SiteAdsManager } from "./SiteAdsManager";
import styles from "./site-ads.module.css";

export const metadata = { title: "الإعلانات المنبثقة" };

export default async function SiteAdsPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const ads = await getAdminSiteAds();
  const adsWithUrls = ads.map((ad) => ({ ...ad, image: backendAssetUrl(ad.image) }));

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>الإعلانات المنبثقة</h1>
        <p>
          نوافذ منبثقة تظهر على كل صفحات الموقع. يمكن توجيهها للزوار غير المسجلين، أو القرّاء، أو
          الكُتّاب. عند إضافة أكثر من إعلان، تظهر واحدًا تلو الآخر - عندما يغلق الزائر إعلانًا، يظهر
          التالي.
        </p>
      </div>
      <SiteAdsManager initialAds={adsWithUrls} />
    </section>
  );
}
