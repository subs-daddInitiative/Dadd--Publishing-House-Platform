import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { BlogSummary } from "@/lib/serverApi";
import { backendAssetUrl } from "@/lib/serverApi";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import styles from "./blog.module.css";

type BlogCardProps = {
  locale: Locale;
  blog: BlogSummary;
  variant?: "list" | "grid";
  byLabel: string;
  favoriteLabel?: string;
};

export function BlogCard({ locale, blog, variant = "list", byLabel, favoriteLabel }: BlogCardProps) {
  const href = `/${locale}/blog/${blog.slug}`;
  const coverImageUrl = backendAssetUrl(blog.cover_image);
  const isGrid = variant === "grid";
  const isHighlighted = Boolean(blog.is_highlighted_active);

  return (
    <Link
      href={href}
      className={`${styles.card} ${isGrid ? styles.cardGridItem : ""} ${isHighlighted ? styles.cardHighlighted : ""} hover-lift`}
    >
      <div className={styles.cardImageWrap}>
        {favoriteLabel && (
          <FavoriteButton locale={locale} itemType="blog" itemId={blog.id} label={favoriteLabel} />
        )}
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={blog.title}
            fill
            sizes={isGrid ? "(max-width: 55rem) 100vw, 25vw" : "(max-width: 40rem) 100vw, 12rem"}
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.cardImageFallback} aria-hidden="true">
            {blog.title.charAt(0)}
          </div>
        )}
        {blog.category_name && <span className={styles.cardCategoryTag}>{blog.category_name}</span>}
        {isHighlighted && <span className={styles.cardHighlightBadge}>⭐ مميز</span>}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{blog.title}</h3>
        {blog.excerpt && <p className={styles.cardExcerpt}>{blog.excerpt}</p>}
        {blog.author_name && (
          <div className={styles.cardAuthorRow}>
            <span className={styles.cardAuthorAvatar} aria-hidden="true">
              {blog.author_name.charAt(0)}
            </span>
            <span className={styles.cardAuthorName}>
              {byLabel} {blog.author_name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
