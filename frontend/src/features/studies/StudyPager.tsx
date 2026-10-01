import Link from "next/link";
import { studyPageHref } from "./studyPageHref";
import styles from "./StudyPager.module.css";

type StudyPagerProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  labels: {
    pagerLabel: string;
    pageIndicator: string;
    previousPage: string;
    nextPage: string;
  };
};

export function StudyPager({ basePath, currentPage, totalPages, labels }: StudyPagerProps) {
  if (totalPages <= 1) return null;

  const indicator = labels.pageIndicator
    .replace("{current}", String(currentPage))
    .replace("{total}", String(totalPages));

  return (
    <nav className={styles.pager} aria-label={labels.pagerLabel}>
      {currentPage > 1 ? (
        <Link href={studyPageHref(basePath, currentPage - 1)} rel="prev" className={styles.pagerLink}>
          {labels.previousPage}
        </Link>
      ) : (
        <span />
      )}
      <span className={styles.pagerIndicator} aria-current="page">
        {indicator}
      </span>
      {currentPage < totalPages ? (
        <Link href={studyPageHref(basePath, currentPage + 1)} rel="next" className={styles.pagerLink}>
          {labels.nextPage}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
