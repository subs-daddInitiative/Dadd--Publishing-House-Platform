import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getPublicStudyBySlug,
  getPublicStudies,
  getPublicBlogs,
  getPublicSettings,
  getPublicBanners,
  getCurrentSubscriber,
  getPublicContentAccessPlans,
  backendAssetUrl,
} from "@/lib/serverApi";
import { notFound } from "next/navigation";
import { Banners } from "@/features/home/Banners";
import { StudyCard } from "@/features/studies/StudyCard";
import { PremiumLock } from "@/features/subscribers/PremiumLock";
import { Sidebar } from "@/components/Sidebar";
import { BlockRenderer } from "@/features/blog/BlockRenderer";
import { StudyTableOfContents } from "@/features/studies/StudyTableOfContents";
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

  const [study, settings] = await Promise.all([getPublicStudyBySlug(slug, locale), getPublicSettings()]);
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

  const [dictionary, study, settings, banners, recentStudiesResult, recentBlogsResult] = await Promise.all([
    getDictionary(locale),
    getPublicStudyBySlug(slug, locale),
    getPublicSettings(),
    getPublicBanners(),
    getPublicStudies({ page: 1, locale }),
    getPublicBlogs({ page: 1, locale }),
  ]);

  if (!study) notFound();

  const [subscriber, contentPlans] = study.locked
    ? await Promise.all([getCurrentSubscriber(), getPublicContentAccessPlans()])
    : [null, []];
  const studyPlans = contentPlans.filter((plan) => plan.category === "studies");
  const sidebarRecentStudies = recentStudiesResult.items.filter((item) => item.id !== study.id).slice(0, 5);

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
    <div className={`container ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className={styles.layoutGrid}>
      <article className={styles.mainCol}>
      <nav className={styles.breadcrumb} aria-label="breadcrumb">
        <Link href={`/${locale}`}>{dictionary.studiesPage.breadcrumbHome}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${locale}/studies`}>{dictionary.studiesPage.breadcrumbStudies}</Link>
        <span aria-hidden="true">/</span>
        <span>{study.title}</span>
      </nav>

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

      {study.content_blocks.length > 0 ? (
        <BlockRenderer blocks={study.content_blocks} lockedFileLabel={dictionary.studiesPage.lockedFile} />
      ) : (
        study.content_intro && (
          <div className={styles.contentBlock} dangerouslySetInnerHTML={{ __html: study.content_intro }} />
        )
      )}

      {study.locked && (
        <PremiumLock
          locale={locale}
          dictionary={dictionary}
          category="studies"
          isLoggedIn={Boolean(subscriber)}
          plans={studyPlans}
          studyId={study.id}
          studyPrice={study.price}
          studyCurrency={study.currency}
        />
      )}

      <Banners
        dictionary={dictionary}
        banners={banners}
        backendUrl={backendUrl}
      />

      {study.content_blocks.length === 0 && study.content_body && (
        <div className={styles.contentBlock} dangerouslySetInnerHTML={{ __html: study.content_body }} />
      )}

      {study.related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>{dictionary.studiesPage.relatedStudies}</h2>
          <div className={styles.postsGrid}>
            {study.related.map((related) => (
              <StudyCard
                key={related.id}
                locale={locale}
                study={related}
                variant="grid"
                byLabel={dictionary.studiesPage.by}
                favoriteLabel={dictionary.booksPage.favorite}
              />
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

      <div className={styles.sidebarCol}>
        <StudyTableOfContents blocks={study.content_blocks} title={dictionary.studiesPage.tableOfContents} />

        <Sidebar
          locale={locale}
          dictionary={dictionary}
          recentStudies={sidebarRecentStudies}
          recentBlogs={recentBlogsResult.items.slice(0, 5)}
          showSubscribeCta={false}
        />
      </div>
      </div>
    </div>
  );
}
