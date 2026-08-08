import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getPublicStudyBySlug,
  getPublicSettings,
  getPublicBanners,
  backendAssetUrl,
} from "@/lib/serverApi";
import { notFound } from "next/navigation";
import { Parallax } from "@/components/Parallax";
import { Banners } from "@/features/home/Banners";
import { StudyCard } from "@/features/studies/StudyCard";
import styles from "@/features/studies/studies.module.css";

type PageParams = { locale: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params;
  if (!isLocale(locale)) return {};
  const slug = decodeURIComponent(rawSlug);

  const [study, settings] = await Promise.all([getPublicStudyBySlug(slug), getPublicSettings()]);
  if (!study) return {};

  const siteName = settings?.siteName || "";
  const description = study.description || undefined;
  const imageUrl = backendAssetUrl(study.cover_image);

  return {
    title: `${study.title} | ${siteName}`,
    description,
    alternates: {
      canonical: `/${locale}/studies/${study.slug}`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/studies/${study.slug}`])),
    },
    openGraph: {
      title: study.title,
      description,
      type: "article",
      publishedTime: study.published_at || undefined,
      authors: study.author ? [study.author] : undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function StudyPostPage({ params }: { params: Promise<PageParams> }) {
  const { locale: rawLocale, slug: rawSlug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const slug = decodeURIComponent(rawSlug);

  const [dictionary, study, settings, banners] = await Promise.all([
    getDictionary(locale),
    getPublicStudyBySlug(slug),
    getPublicSettings(),
    getPublicBanners(),
  ]);

  if (!study) notFound();

  const siteName = settings?.siteName || dictionary.common.siteName;
  const logoUrl = backendAssetUrl(settings?.logo);
  const heroImageUrl = backendAssetUrl(study.cover_image);
  const mainImageUrl = backendAssetUrl(study.main_image);
  const pdfUrl = backendAssetUrl(study.pdf_file);
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  const publishedDate = study.published_at ? new Date(study.published_at.replace(" ", "T")) : null;
  const dateLabel = publishedDate ? publishedDate.toLocaleDateString(locale, { dateStyle: "long" }) : "";

  const canonicalPath = `/${locale}/studies/${study.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    image: heroImageUrl ? [heroImageUrl] : undefined,
    datePublished: study.published_at || undefined,
    dateModified: study.updated_at,
    author: study.author ? { "@type": "Person", name: study.author } : undefined,
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: logoUrl ? { "@type": "ImageObject", url: logoUrl } : undefined,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalPath,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dictionary.studiesPage.breadcrumbHome, item: `/${locale}` },
      { "@type": "ListItem", position: 2, name: dictionary.studiesPage.breadcrumbStudies, item: `/${locale}/studies` },
      { "@type": "ListItem", position: 3, name: study.title, item: canonicalPath },
    ],
  };

  return (
    <article className={`container ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className={styles.breadcrumb} aria-label="breadcrumb">
        <Link href={`/${locale}`}>{dictionary.studiesPage.breadcrumbHome}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${locale}/studies`}>{dictionary.studiesPage.breadcrumbStudies}</Link>
        <span aria-hidden="true">/</span>
        <span>{study.title}</span>
      </nav>

      {heroImageUrl && (
        <div className={styles.heroBand}>
          <Parallax speed={0.06} className={styles.heroBandParallax}>
            <Image src={heroImageUrl} alt={study.title} fill sizes="100vw" className={styles.heroBandImage} priority />
          </Parallax>
          <div className={styles.heroBandOverlay} aria-hidden="true" />
        </div>
      )}

      <header className={styles.postHeader}>
        {study.category_name && <span className={styles.postCategoryTag}>{study.category_name}</span>}
        <h1 className={styles.postTitle}>{study.title}</h1>
        <p className={styles.postMeta}>
          {publishedDate && <time dateTime={study.published_at || undefined}>{dateLabel}</time>}
          {study.author && (
            <>
              {publishedDate ? " · " : ""}
              {dictionary.studiesPage.by} {study.author}
            </>
          )}
        </p>

        {pdfUrl && (
          <div className={styles.pdfButtonRow}>
            <a href={pdfUrl} className={styles.pdfButton} target="_blank" rel="noopener noreferrer">
              {dictionary.studiesPage.downloadPdf}
            </a>
          </div>
        )}
      </header>

      {mainImageUrl && (
        <div className={styles.mainImageWrap}>
          <Image
            src={mainImageUrl}
            alt={study.title}
            fill
            sizes="(max-width: 60rem) 100vw, 56rem"
            className={styles.mainImage}
          />
        </div>
      )}

      {study.content_intro && (
        <div className={styles.contentBlock} dangerouslySetInnerHTML={{ __html: study.content_intro }} />
      )}

      <Banners
        dictionary={dictionary}
        banners={banners}
        backendUrl={backendUrl}
      />

      {study.content_body && (
        <div className={styles.contentBlock} dangerouslySetInnerHTML={{ __html: study.content_body }} />
      )}

      {study.related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>{dictionary.studiesPage.relatedStudies}</h2>
          <div className={styles.postsGrid}>
            {study.related.map((related) => (
              <StudyCard key={related.id} locale={locale} study={related} variant="grid" byLabel={dictionary.studiesPage.by} />
            ))}
          </div>
        </section>
      )}

      <div className={styles.postActions}>
        <Link href={`/${locale}`} className={styles.postActionPrimary}>
          {dictionary.studiesPage.backHome}
        </Link>
        <Link href={`/${locale}/studies`} className={styles.postActionSecondary}>
          {dictionary.studiesPage.moreStudies}
        </Link>
      </div>
    </article>
  );
}
