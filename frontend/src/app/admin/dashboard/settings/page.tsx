import { getAdminSettings, getAdminBanners, backendAssetUrl } from "@/lib/serverApi";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { LogoUploadForm } from "./LogoUploadForm";
import { SocialLinksForm } from "./SocialLinksForm";
import { BannersManager } from "./BannersManager";

export const metadata = { title: "الإعدادات" };

export default async function SettingsPage() {
  const [settings, banners] = await Promise.all([getAdminSettings(), getAdminBanners()]);

  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  return (
    <section>
      <h1>الإعدادات</h1>

      <GeneralSettingsForm
        initialSiteName={settings?.site_name || ""}
        initialCallNumber={settings?.call_number || ""}
        initialWhatsappNumber={settings?.whatsapp_number || ""}
        initialAboutText={settings?.about_text || ""}
      />

      <LogoUploadForm currentLogoUrl={backendAssetUrl(settings?.logo)} />

      <SocialLinksForm initialLinks={settings?.socialLinks || []} />

      <BannersManager banners={banners} backendUrl={backendUrl} />
    </section>
  );
}
