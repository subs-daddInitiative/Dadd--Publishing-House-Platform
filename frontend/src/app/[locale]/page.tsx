import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getPublicSettings,
  getPublicBanners,
  getPublicStats,
  getPublicBlogs,
  backendAssetUrl,
} from "@/lib/serverApi";
import { Hero } from "@/features/home/Hero";
import { Stats } from "@/features/home/Stats";
import { About } from "@/features/home/About";
import { Banners } from "@/features/home/Banners";
import { BlogsSection } from "@/features/home/BlogsSection";
import { Contact } from "@/features/home/Contact";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const [dictionary, settings, banners, stats, blogList] = await Promise.all([
    getDictionary(locale),
    getPublicSettings(),
    getPublicBanners(),
    getPublicStats(),
    getPublicBlogs(1),
  ]);

  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const brandName = settings?.siteName || dictionary.common.siteName;
  const logoUrl = backendAssetUrl(settings?.logo);

  return (
    <>
      <Hero locale={locale} dictionary={dictionary} brandName={brandName} />
      <Stats dictionary={dictionary} stats={stats} />
      <About
        dictionary={dictionary}
        aboutText={settings?.aboutText ?? null}
        logoUrl={logoUrl}
        brandName={brandName}
      />
      <Banners dictionary={dictionary} banners={banners} backendUrl={backendUrl} />
      <BlogsSection locale={locale} dictionary={dictionary} blogs={blogList.items} />
      <Contact
        dictionary={dictionary}
        callNumber={settings?.callNumber ?? null}
        whatsappNumber={settings?.whatsappNumber ?? null}
        socialLinks={settings?.socialLinks || []}
      />
    </>
  );
}
