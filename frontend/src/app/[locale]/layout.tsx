import type { Metadata } from "next";
import type { ReactNode } from "react";
import { locales, localeDirections, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getPublicSettings,
  backendAssetUrl,
  getCurrentSubscriber,
  getPublicNewsTicker,
  getPublicSiteAds,
} from "@/lib/serverApi";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsTicker } from "@/components/NewsTicker";
import { AdsPopupManager } from "@/components/AdsPopupManager";
import { SyncHtmlAttributes } from "@/components/SyncHtmlAttributes";
import { StoreProvider } from "@/components/store/StoreProvider";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.common.siteName,
    description: dictionary.home.heroSubtitle,
    alternates: {
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}`])),
    },
    openGraph: {
      title: dictionary.common.siteName,
      description: dictionary.home.heroSubtitle,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.common.siteName,
      description: dictionary.home.heroSubtitle,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [dictionary, settings, subscriber] = await Promise.all([
    getDictionary(locale),
    getPublicSettings(),
    getCurrentSubscriber(),
  ]);
  const dir = localeDirections[locale];
  const siteName = settings?.siteName || dictionary.common.siteName;
  const logoUrl = backendAssetUrl(settings?.logo);
  const tickerAudience = subscriber?.account_type === "writer" ? "writer" : "reader";
  const tickerItems = await getPublicNewsTicker(tickerAudience);
  const adsAudience = !subscriber ? "guest" : subscriber.account_type === "writer" ? "writer" : "reader";
  const siteAdsRaw = await getPublicSiteAds(adsAudience);
  const siteAds = siteAdsRaw.map((ad) => ({ ...ad, image: backendAssetUrl(ad.image) }));

  return (
    <StoreProvider>
      <FavoritesProvider isLoggedIn={Boolean(subscriber)}>
        <SyncHtmlAttributes lang={locale} dir={dir} />
        <a href="#main-content" className="skip-link">
          {dictionary.common.skipToContent}
        </a>
        <NewsTicker items={tickerItems} />
        <Header locale={locale} dictionary={dictionary} siteName={siteName} logoUrl={logoUrl} subscriber={subscriber} />
        <main id="main-content">{children}</main>
        <Footer
          locale={locale}
          dictionary={dictionary}
          siteName={siteName}
          logoUrl={logoUrl}
          callNumber={settings?.callNumber ?? null}
          whatsappNumber={settings?.whatsappNumber ?? null}
          socialLinks={settings?.socialLinks || []}
        />
        <AdsPopupManager ads={siteAds} closeLabel={dictionary.common.close} />
      </FavoritesProvider>
    </StoreProvider>
  );
}
