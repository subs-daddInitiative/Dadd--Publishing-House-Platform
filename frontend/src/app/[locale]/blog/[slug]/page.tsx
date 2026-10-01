import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/siteUrl";
import Image from "next/image";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getPublicBlogBySlug,
  getPublicBlogs,
  getPublicStudies,
  getPublicSettings,
  getCurrentSubscriber,
  getPublicContentAccessPlans,
  backendAssetUrl,
} from "@/lib/serverApi";
import { notFound } from "next/navigation";
import { BlogCard } from "@/features/blog/BlogCard";
import { BlockRenderer } from "@/features/blog/BlockRenderer";
import { PremiumLock } from "@/features/subscribers/PremiumLock";
import { Sidebar } from "@/components/Sidebar";
import { PostStats } from "@/components/PostStats";
import { buildArticleJsonLd } from "@/lib/articleJsonLd";
import { ShareBar } from "@/components/ShareBar";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import styles from "@/features/blog/blog.module.css";

type PageParams = { locale: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params;
  if (!isLocale(locale)) return {};
  const slug = decodeURIComponent(rawSlug);

  const [blog, settings] = await Promise.all([getPublicBlogBySlug(slug, locale), getPublicSettings()]);
  if (!blog) return {};

  const siteName = settings?.siteName || "";
  const description = blog.excerpt || undefined;
  const imageUrl = backendAssetUrl(blog.cover_image);

  return {
    title: `${blog.title} | ${siteName}`,
    description,
    alternates: {
      canonical: `/${locale}/blog/${blog.slug}`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}/blog/${blog.slug}`])),
    },
    openGraph: {
      title: blog.title,
      description,
      type: "article",
      publishedTime: blog.published_at || undefined,
      authors: blog.author_name ? [blog.author_name] : undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      locale,
      siteName: siteName || undefined,
      url: `/${locale}/blog/${blog.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<PageParams> }) {
  const { locale: rawLocale, slug: rawSlug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const slug = decodeURIComponent(rawSlug);

  const [dictionary, blog, recentBlogsResult, recentStudiesResult] = await Promise.all([
    getDictionary(locale),
    getPublicBlogBySlug(slug, locale),
    getPublicBlogs({ page: 1, locale }),
    getPublicStudies({ page: 1, locale }),
  ]);

  if (!blog) notFound();

  const [subscriber, contentPlans] = await Promise.all([
    getCurrentSubscriber(),
    blog.locked ? getPublicContentAccessPlans() : Promise.resolve([]),
  ]);
  const blogPlans = contentPlans.filter((plan) => plan.category === "blogs");
  const sidebarRecentBlogs = recentBlogsResult.items.filter((item) => item.id !== blog.id).slice(0, 5);

  const coverImageUrl = backendAssetUrl(blog.cover_image);
  const publishedDate = blog.published_at ? new Date(blog.published_at.replace(" ", "T")) : null;
  const dateLabel = publishedDate ? publishedDate.toLocaleDateString(locale, { dateStyle: "long" }) : "";

  const jsonLd = buildArticleJsonLd({
    headline: blog.title,
    description: blog.excerpt,
    imageUrl: coverImageUrl,
    publishedAt: blog.published_at,
    updatedAt: blog.updated_at,
    authorName: blog.author_name,
    path: `/${locale}/blog/${blog.slug}`,
    locale,
    isPremium: Boolean(blog.is_premium),
    keywords: blog.seo_keywords,
  });

  return (
    <div className={`container ${styles.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.layoutGrid}>
      <article className={styles.mainCol}>
      <header className={styles.postHeader}>
        {blog.category_name && <span className={styles.postCategoryTag}>{blog.category_name}</span>}
        <h1 className={styles.postTitle}>{blog.title}</h1>
        <p className={styles.postMeta}>
          {publishedDate && <time dateTime={blog.published_at || undefined}>{dateLabel}</time>}
          {blog.author_name && (
            <>
              {publishedDate ? " · " : ""}
              {dictionary.blogPage.by} {blog.author_name}
            </>
          )}
        </p>
        {blog.excerpt && <p className={styles.postExcerpt}>{blog.excerpt}</p>}
      </header>

      <ShareBar
        url={absoluteUrl(`/${locale}/blog/${blog.slug}`)}
        title={blog.title}
        labels={dictionary.share}
      />

      <PostStats stats={blog.stats} />

      {coverImageUrl && (
        <div className={styles.postImageWrap}>
          <Image src={coverImageUrl} alt={blog.title} fill sizes="(max-width: 60rem) 100vw, 56rem" className={styles.postImage} priority />
        </div>
      )}

      {blog.content_blocks.length > 0 && (
        <BlockRenderer blocks={blog.content_blocks} lockedFileLabel={dictionary.blogPage.lockedFile} />
      )}

      {blog.locked && (
        <PremiumLock
          locale={locale}
          dictionary={dictionary}
          category="blogs"
          isLoggedIn={Boolean(subscriber)}
          plans={blogPlans}
        />
      )}

      {blog.related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>{dictionary.blogPage.relatedArticles}</h2>
          <div className={styles.postsGrid}>
            {blog.related.map((related) => (
              <BlogCard
                key={related.id}
                locale={locale}
                blog={related}
                variant="grid"
                byLabel={dictionary.blogPage.by}
                favoriteLabel={dictionary.booksPage.favorite}
              />
            ))}
          </div>
        </section>
      )}

      <div className={styles.postActions}>
        <Link href={`/${locale}`} className={styles.postActionPrimary}>
          {dictionary.blogPage.backHome}
        </Link>
        <Link href={`/${locale}/blog`} className={styles.postActionSecondary}>
          {dictionary.blogPage.moreArticles}
        </Link>
      </div>
      </article>

      <Sidebar
        locale={locale}
        dictionary={dictionary}
        recentBlogs={sidebarRecentBlogs}
        recentStudies={recentStudiesResult.items.slice(0, 5)}
      />
      </div>

      {!subscriber && (
        <NewsletterPopup
          locale={locale}
          categoryName={locale === "ar" ? blog.category_name : null}
          categorySlug={blog.category_slug}
          blogSlug={blog.slug}
          title={dictionary.newsletterPopup.title}
          descriptionWithCategory={dictionary.newsletterPopup.descriptionWithCategory}
          descriptionGeneric={dictionary.newsletterPopup.descriptionGeneric}
          emailPlaceholder={dictionary.newsletterPopup.emailPlaceholder}
          subscribeLabel={dictionary.newsletterPopup.subscribeLabel}
          dismissLabel={dictionary.newsletterPopup.dismissLabel}
          successMessage={dictionary.newsletterPopup.successMessage}
          consentPrefix={dictionary.newsletterPopup.consentPrefix}
          consentAnd={dictionary.newsletterPopup.consentAnd}
          consentRequired={dictionary.newsletterPopup.consentRequired}
          privacyLabel={dictionary.footer.privacyLink}
          termsLabel={dictionary.footer.termsLink}
        />
      )}
    </div>
  );
}
