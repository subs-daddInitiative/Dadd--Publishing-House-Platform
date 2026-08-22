import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { backendAssetUrl } from "@/lib/serverApi";
import styles from "./Sidebar.module.css";

type SidebarItem = {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  published_at: string | null;
  is_premium?: number;
};

type SidebarCategory = { id: number; name: string; slug: string };

type SidebarProps = {
  locale: Locale;
  dictionary: Dictionary;
  recentBlogs?: SidebarItem[];
  recentStudies?: SidebarItem[];
  categories?: SidebarCategory[];
  categoriesBasePath?: string;
  showSubscribeCta?: boolean;
};

function SidebarList({
  locale,
  title,
  items,
  basePath,
  premiumBadgeLabel,
}: {
  locale: Locale;
  title: string;
  items: SidebarItem[];
  basePath: string;
  premiumBadgeLabel: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>{title}</h2>
      <ul className={styles.list}>
        {items.map((item) => {
          const imageUrl = backendAssetUrl(item.cover_image);
          const date = item.published_at
            ? new Date(item.published_at.replace(" ", "T")).toLocaleDateString(locale, { dateStyle: "medium" })
            : null;

          return (
            <li key={item.id} className={styles.listItem}>
              <Link href={`/${locale}${basePath}/${item.slug}`} className={styles.listItemLink}>
                <span className={styles.thumbWrap}>
                  {imageUrl ? (
                    <Image src={imageUrl} alt={item.title} fill sizes="4rem" className={styles.thumb} />
                  ) : (
                    <span className={styles.thumbFallback} aria-hidden="true">{item.title.charAt(0)}</span>
                  )}
                </span>
                <span className={styles.listItemBody}>
                  <span className={styles.listItemTitle}>{item.title}</span>
                  <span className={styles.listItemMeta}>
                    {Boolean(item.is_premium) && <span className={styles.premiumBadge}>{premiumBadgeLabel}</span>}
                    {date && <span>{date}</span>}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Sidebar({
  locale,
  dictionary,
  recentBlogs = [],
  recentStudies = [],
  categories = [],
  categoriesBasePath,
  showSubscribeCta = true,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      {showSubscribeCta && (
        <div className={styles.subscribeCard}>
          <h2 className={styles.subscribeTitle}>{dictionary.sidebar.subscribeCtaTitle}</h2>
          <p className={styles.subscribeText}>{dictionary.sidebar.subscribeCtaText}</p>
          <Link href={`/${locale}/subscribe`} className={styles.subscribeButton}>
            {dictionary.sidebar.subscribeCtaButton}
          </Link>
        </div>
      )}

      <SidebarList
        locale={locale}
        title={dictionary.sidebar.recentBlogsTitle}
        items={recentBlogs}
        basePath="/blog"
        premiumBadgeLabel={dictionary.sidebar.premiumBadge}
      />

      <SidebarList
        locale={locale}
        title={dictionary.sidebar.recentStudiesTitle}
        items={recentStudies}
        basePath="/studies"
        premiumBadgeLabel={dictionary.sidebar.premiumBadge}
      />

      {categories.length > 0 && categoriesBasePath && (
        <div className={styles.block}>
          <h2 className={styles.blockTitle}>{dictionary.sidebar.categoriesTitle}</h2>
          <div className={styles.tagsRow}>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}${categoriesBasePath}?category=${encodeURIComponent(category.slug)}`}
                className={styles.tag}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
