import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { StudySummary } from "@/lib/serverApi";
import { backendAssetUrl } from "@/lib/serverApi";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import styles from "./studies.module.css";

type StudyCardProps = {
  locale: Locale;
  study: StudySummary;
  variant?: "list" | "grid";
  byLabel: string;
  favoriteLabel?: string;
};

export function StudyCard({ locale, study, variant = "list", byLabel, favoriteLabel }: StudyCardProps) {
  const href = `/${locale}/studies/${study.slug}`;
  const coverImageUrl = backendAssetUrl(study.cover_image);
  const isGrid = variant === "grid";

  return (
    <Link href={href} className={`${styles.card} ${isGrid ? styles.cardGridItem : ""} hover-lift`}>
      <div className={styles.cardImageWrap}>
        {favoriteLabel && (
          <FavoriteButton locale={locale} itemType="study" itemId={study.id} label={favoriteLabel} />
        )}
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={study.title}
            fill
            sizes={isGrid ? "(max-width: 55rem) 100vw, 25vw" : "(max-width: 40rem) 100vw, 12rem"}
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
        {study.description && <p className={styles.cardExcerpt}>{study.description}</p>}
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
