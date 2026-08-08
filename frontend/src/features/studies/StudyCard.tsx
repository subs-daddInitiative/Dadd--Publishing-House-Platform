import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { StudySummary } from "@/lib/serverApi";
import { backendAssetUrl } from "@/lib/serverApi";
import styles from "./studies.module.css";

type StudyCardProps = {
  locale: Locale;
  study: StudySummary;
  variant?: "featured" | "compact" | "grid";
  byLabel: string;
};

const VARIANT_CLASS = {
  featured: "cardFeatured",
  compact: "cardCompact",
  grid: "cardGrid",
} as const;

export function StudyCard({ locale, study, variant = "grid", byLabel }: StudyCardProps) {
  const href = `/${locale}/studies/${study.slug}`;
  const coverImageUrl = backendAssetUrl(study.cover_image);

  return (
    <Link href={href} className={`${styles.card} ${styles[VARIANT_CLASS[variant]]} hover-lift`}>
      <div className={styles.cardImageWrap}>
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={study.title}
            fill
            sizes={variant === "featured" ? "(max-width: 45rem) 100vw, 50vw" : "(max-width: 45rem) 100vw, 25vw"}
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.cardImageFallback} aria-hidden="true">
            {study.title.charAt(0)}
          </div>
        )}
        {study.category_name && <span className={styles.cardCategoryTag}>{study.category_name}</span>}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{study.title}</h3>
        {variant !== "compact" && study.description && (
          <p className={styles.cardExcerpt}>{study.description}</p>
        )}
        {study.author && (
          <div className={styles.cardMetaRow}>
            <span className={styles.cardAuthorAvatar} aria-hidden="true">
              {study.author.charAt(0)}
            </span>
            <span className={styles.cardMetaText}>
              {byLabel} {study.author}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
