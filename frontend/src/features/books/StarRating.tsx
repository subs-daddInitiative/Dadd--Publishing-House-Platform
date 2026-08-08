import styles from "./books.module.css";

type StarRatingProps = {
  rating: number;
  reviewsCount?: number;
  className?: string;
};

const STARS = "★★★★★";

export function StarRating({ rating, reviewsCount, className }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, rating));
  const fillPercent = (clamped / 5) * 100;

  return (
    <span className={`${styles.starRating} ${className ?? ""}`}>
      <span className={styles.starsTrack} aria-hidden="true">
        {STARS}
        <span className={styles.starsFill} style={{ width: `${fillPercent}%` }}>
          {STARS}
        </span>
      </span>
      <span className={styles.srOnly}>{clamped.toFixed(1)} / 5</span>
      {typeof reviewsCount === "number" && (
        <span className={styles.reviewsCount}>({reviewsCount})</span>
      )}
    </span>
  );
}
