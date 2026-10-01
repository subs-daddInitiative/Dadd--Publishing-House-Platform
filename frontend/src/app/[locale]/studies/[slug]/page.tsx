import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteUrl";
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
import { PostStats } from "@/components/PostStats";
import { buildArticleJsonLd } from "@/lib/articleJsonLd";
import { isStudyTypeKey } from "@/features/studies/studyTypes";
import { ShareBar } from "@/components/ShareBar";
import { BlockRenderer } from "@/features/blog/BlockRenderer";
import { StudyTableOfContents } from "@/features/studies/StudyTableOfContents";
import { StudyPager } from "@/features/studies/StudyPager";
import { studyPageHref } from "@/features/studies/studyPageHref";
import styles from "@/features/studies/studies.module.css";

type PageParams = { locale: string; slug: string };
type PageSearchParams = { page?: string };

// ?page=abc or ?page=0 fall back to the first page.
function parsePageNumber(raw: string | undefined): number {
  const page = Number(raw);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params;
  if (!isLocale(locale)) return {};
  const slug = decodeURIComponent(rawSlug);
  const currentPage = parsePageNumber((await searchParams).page);

  const [study, settings, dictionary] = await Promise.all([
    getPublicStudyBySlug(slug, locale),
    getPublicSettings(),
    getDictionary(locale),
  ]);
  if (!study || currentPage > study.total_pages) return {};

  const basePath = `/${locale}/studies/${study.slug}`;
  const pagePath = studyPageHref(basePath, currentPage);
  const pageSuffix = currentPage > 1 ? ` - ${dictionary.studiesPage.pageLabel} ${currentPage}` : "";

  const siteName = settings?.siteName || "";
  const description = study.description || undefined;
  const imageUrl = backendAssetUrl(study.cover_image);

  return {
    title: `${study.title}${pageSuffix} | ${siteName}`,
    description,
    alternates: {
      canonical: pagePath,
      languages: Object.fromEntries(locales.map((loc) => [loc, studyPageHref(`/${loc}/studies/${study.slug}`, currentPage)])),
    },
    pagination: {
      previous: currentPage > 1 ? studyPageHref(basePath, currentPage - 1) : null,
      next: currentPage < study.total_pages ? studyPageHref(basePath, currentPage + 1) : null,
    },
    openGraph: {
      title: study.title,
      description,
      type: "article",
      publishedTime: study.published_at || undefined,
      authors: study.author ? [study.author] : undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      locale,
      siteName: siteName || undefined,
      url: pagePath,
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function StudyPostPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { locale: rawLocale, slug: rawSlug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const slug = decodeURIComponent(rawSlug);

  const [dictionary, study, banners, recentStudiesResult, recentBlogsResult] = await Promise.all([
    getDictionary(locale),
    getPublicStudyBySlug(slug, locale),
    getPublicBanners(),
    getPublicStudies({ page: 1, locale }),
    getPublicBlogs({ page: 1, locale }),
  ]);

  if (!study) notFound();

  const currentPage = parsePageNumber((await searchParams).page);
  if (currentPage > study.total_pages) notFound();
  const isFirstPage = currentPage === 1;
  const pageBlocks = study.content_blocks.filter((block) => block.page === currentPage);

  const [subscriber, contentPlans] = study.locked
    ? await Promise.all([getCurrentSubscriber(), getPublicContentAccessPlans()])
    : [null, []];
  const studyPlans = contentPlans.filter((plan) => plan.category === "studies");
  const sidebarRecentStudies = recentStudiesResult.items.filter((item) => item.id !== study.id).slice(0, 5);

  const heroImageUrl = backendAssetUrl(study.cover_image);
  const mainImageUrl = backendAssetUrl(study.main_image);
  const pdfUrl = backendAssetUrl(study.pdf_file);
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  const publishedDate = study.published_at ? new Date(study.published_at.replace(" ", "T")) : null;
  const dateLabel = publishedDate ? publishedDate.toLocaleDateString(locale, { dateStyle: "long" }) : "";

  const basePath = `/${locale}/studies/${study.slug}`;
  const canonicalPath = studyPageHref(basePath, currentPage);

  const studyTypeLabel = isStudyTypeKey(study.study_type) ? dictionary.studiesPage.studyTypes[study.study_type] : null;

  const jsonLd = buildArticleJsonLd({
    headline: study.title,
    description: study.description,
    imageUrl: heroImageUrl,
    publishedAt: study.published_at,
    updatedAt: study.updated_at,
    authorName: study.author,
    path: canonicalPath,
    locale,
    isPremium: Boolean(study.is_premium),
    type: "ScholarlyArticle",
    section: studyTypeLabel,
    doi: study.doi,
    reportNumber: study.report_number,
    seriesNumber: study.series_number,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dictionary.studiesPage.breadcrumbHome, item: absoluteUrl(`/${locale}`) },
      { "@type": "ListItem", position: 2, name: dictionary.studiesPage.breadcrumbStudies, item: absoluteUrl(`/${locale}/studies`) },
      { "@type": "ListItem", position: 3, name: study.title, item: absoluteUrl(canonicalPath) },
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
        {isFirstPage && (
          <>
            {study.category_name && <span className={styles.postCategoryTag}>{study.category_name}</span>}
            {studyTypeLabel && <span className={styles.postTypeTag}>{studyTypeLabel}</span>}
          </>
        )}
        <h1 className={styles.postTitle}>{study.title}</h1>
        {!isFirstPage && (
          <p className={styles.postMeta}>
            {dictionary.studiesPage.pageIndicator
              .replace("{current}", String(currentPage))
              .replace("{total}", String(study.total_pages))}
          </p>
        )}
        {isFirstPage && (
          <>
            <p className={styles.postMeta}>
              {publishedDate && <time dateTime={study.published_at || undefined}>{dateLabel}</time>}
              {study.author && (
                <>
                  {publishedDate ? " · " : ""}
                  {dictionary.studiesPage.by} {study.author}
                </>
              )}
            </p>
            {(study.report_number || study.series_number) && (
              <p className={styles.postMeta}>
                {study.report_number && (
                  <>
                    {dictionary.studiesPage.reportNumber}: <bdi>{study.report_number}</bdi>
                  </>
                )}
                {study.report_number && study.series_number ? " · " : ""}
                {study.series_number && (
                  <>
                    {dictionary.studiesPage.seriesNumber}: <bdi>{study.series_number}</bdi>
                  </>
                )}
              </p>
            )}
            {study.doi && (
              <p className={styles.postMeta}>
                {dictionary.studiesPage.doi}:{" "}
                <a href={`https://doi.org/${study.doi}`} target="_blank" rel="noopener noreferrer" dir="ltr">
                  {study.doi}
                </a>
              </p>
            )}

            {pdfUrl && (
              <div className={styles.pdfButtonRow}>
                <a href={pdfUrl} className={styles.pdfButton} target="_blank" rel="noopener noreferrer">
                  {dictionary.studiesPage.downloadPdf}
                </a>
              </div>
            )}
          </>
        )}
      </header>

      {isFirstPage && (
        <>
          <ShareBar url={absoluteUrl(basePath)} title={study.title} labels={dictionary.share} />

          <PostStats stats={study.stats} />
        </>
      )}

      {isFirstPage && mainImageUrl && (
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
        <BlockRenderer blocks={pageBlocks} lockedFileLabel={dictionary.studiesPage.lockedFile} />
      ) : (
        isFirstPage &&
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

      <StudyPager
        basePath={basePath}
        currentPage={currentPage}
        totalPages={study.total_pages}
        labels={dictionary.studiesPage}
      />

      <Banners
        dictionary={dictionary}
        banners={banners}
        backendUrl={backendUrl}
      />

      {isFirstPage && study.content_blocks.length === 0 && study.content_body && (
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

      <div className={styles.recentSection}>
        <Sidebar
          locale={locale}
          dictionary={dictionary}
          recentStudies={sidebarRecentStudies}
          recentBlogs={recentBlogsResult.items.slice(0, 5)}
          showSubscribeCta={false}
        />
      </div>

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
        <StudyTableOfContents
          blocks={study.content_blocks}
          title={dictionary.studiesPage.tableOfContents}
          basePath={basePath}
          currentPage={currentPage}
          totalPages={study.total_pages}
          pageLabel={dictionary.studiesPage.pageLabel}
        />
      </div>
      </div>
    </div>
  );
}
