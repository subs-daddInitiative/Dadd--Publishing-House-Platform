import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getPublicSettings,
  getPublicBanners,
  getPublicStats,
  getPublicBlogs,
  getPublicStudies,
  getPublicAboutFeatures,
} from "@/lib/serverApi";
import { Hero } from "@/features/home/Hero";
import { Stats } from "@/features/home/Stats";
import { About } from "@/features/home/About";
import { Banners } from "@/features/home/Banners";
import { StudiesSection } from "@/features/home/StudiesSection";
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
  const [dictionary, settings, banners, stats, blogList, studyList, aboutFeatures] = await Promise.all([
    getDictionary(locale),
    getPublicSettings(),
    getPublicBanners(),
    getPublicStats(),
    getPublicBlogs(1),
    getPublicStudies({ page: 1 }),
    getPublicAboutFeatures(),
  ]);

  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const brandName = settings?.siteName || dictionary.common.siteName;

  return (
    <>
      <Hero locale={locale} dictionary={dictionary} brandName={brandName} />
      <Stats dictionary={dictionary} stats={stats} />
      <About dictionary={dictionary} aboutText={settings?.aboutText ?? null} features={aboutFeatures} />
      <BlogsSection locale={locale} dictionary={dictionary} blogs={blogList.items} />
      <Banners dictionary={dictionary} banners={banners} backendUrl={backendUrl} />
      <StudiesSection locale={locale} dictionary={dictionary} studies={studyList.items} />
      <Contact
        dictionary={dictionary}
        callNumber={settings?.callNumber ?? null}
        whatsappNumber={settings?.whatsappNumber ?? null}
        socialLinks={settings?.socialLinks || []}
      />
    </>
  );
}
