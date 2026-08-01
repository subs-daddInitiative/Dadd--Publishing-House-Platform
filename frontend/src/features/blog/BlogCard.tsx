import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { BlogSummary } from "@/lib/serverApi";
import { backendAssetUrl } from "@/lib/serverApi";
import styles from "./blog.module.css";

type BlogCardProps = {
  locale: Locale;
  blog: BlogSummary;
  variant?: "featured" | "compact" | "grid";
  byLabel: string;
};

const VARIANT_CLASS = {
  featured: "cardFeatured",
  compact: "cardCompact",
  grid: "cardGrid",
} as const;

export function BlogCard({ locale, blog, variant = "grid", byLabel }: BlogCardProps) {
  const href = `/${locale}/blog/${blog.slug}`;
  const coverImageUrl = backendAssetUrl(blog.cover_image);

  return (
    <Link href={href} className={`${styles.card} ${styles[VARIANT_CLASS[variant]]} hover-lift`}>
      <div className={styles.cardImageWrap}>
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={blog.title}
            fill
            sizes={variant === "featured" ? "(max-width: 45rem) 100vw, 50vw" : "(max-width: 45rem) 100vw, 25vw"}
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.cardImageFallback} aria-hidden="true">
            {blog.title.charAt(0)}
          </div>
        )}
        {blog.category_name && <span className={styles.cardCategoryTag}>{blog.category_name}</span>}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{blog.title}</h3>
        {variant !== "compact" && blog.excerpt && <p className={styles.cardExcerpt}>{blog.excerpt}</p>}
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
