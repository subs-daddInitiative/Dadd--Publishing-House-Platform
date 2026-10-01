import type { Locale } from "@/i18n/config";
import type { PublicSettings } from "@/lib/serverApi";
import { backendAssetUrl } from "@/lib/serverApi";
import { SITE_URL, absoluteUrl } from "@/lib/siteUrl";

type SiteJsonLdProps = {
  locale: Locale;
  settings: PublicSettings | null;
  fallbackName: string;
  fallbackDescription: string;
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// Escaping "<" keeps admin-entered text from ever closing the script tag.
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function SiteJsonLd({ locale, settings, fallbackName, fallbackDescription }: SiteJsonLdProps) {
  const name = settings?.siteName || fallbackName;
  const description = settings?.aboutText?.trim() || fallbackDescription;
  const logoUrl = backendAssetUrl(settings?.logo);
  const sameAs = [
    ...new Set(
      (settings?.socialLinks || [])
        .filter((link) => link.is_active && /^https?:\/\//i.test(link.url))
        .map((link) => link.url)
    ),
  ];
  const telephone = settings?.callNumber?.trim();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name,
    url: absoluteUrl("/"),
    description,
    ...(logoUrl && { logo: { "@type": "ImageObject", url: logoUrl } }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(telephone && {
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: telephone },
    }),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name,
    url: absoluteUrl(`/${locale}`),
    inLanguage: locale,
    publisher: { "@id": ORGANIZATION_ID },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(website) }} />
    </>
  );
}
