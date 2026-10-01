import type { ReactNode } from "react";
import { ShareBar } from "@/components/ShareBar";
import type { StudyDetail } from "@/lib/serverApi";
import styles from "./StudyArticleHeader.module.css";

type ShareLabels = Parameters<typeof ShareBar>[0]["labels"];
// `stacked` puts a long value (like a DOI) under its label instead of beside it.
type Fact = { term: string; value: ReactNode; stacked?: boolean };

type StudyArticleHeaderProps = {
  study: StudyDetail;
  locale: string;
  typeLabel: string | null;
  pdfUrl: string | null;
  shareUrl: string;
  shareLabels: ShareLabels;
  labels: {
    by: string;
    downloadPdf: string;
    abstract: string;
    studyInfo: string;
    publishedOn: string;
    updatedOn: string;
    category: string;
    type: string;
    access: string;
    accessFree: string;
    accessPremium: string;
    language: string;
    reportNumber: string;
    seriesNumber: string;
    doi: string;
  };
};

function formatDate(value: string | null, locale: string): string | null {
  if (!value) return null;
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString(locale, { dateStyle: "long" });
}

function authorInitial(name: string): string {
  return Array.from(name.trim())[0] ?? "";
}

// Article-information header for the first page of a study: classification
// chips, title, author, actions (download + share), then the abstract beside a
// compact "study information" panel — the layout readers know from journal sites.
export function StudyArticleHeader({
  study,
  locale,
  typeLabel,
  pdfUrl,
  shareUrl,
  shareLabels,
  labels,
}: StudyArticleHeaderProps) {
  const publishedDate = formatDate(study.published_at, locale);
  const updatedDate = formatDate(study.updated_at, locale);
  const languageName = new Intl.DisplayNames([locale], { type: "language" }).of(locale) ?? locale;

  const facts: Fact[] = [];
  const addFact = (term: string, value: ReactNode, stacked = false) => facts.push({ term, value, stacked });

  if (publishedDate) {
    addFact(labels.publishedOn, <time dateTime={study.published_at ?? undefined}>{publishedDate}</time>);
  }
  if (updatedDate && updatedDate !== publishedDate) {
    addFact(labels.updatedOn, <time dateTime={study.updated_at}>{updatedDate}</time>);
  }
  if (study.doi) {
    addFact(
      labels.doi,
      <a href={`https://doi.org/${study.doi}`} target="_blank" rel="noopener noreferrer" dir="ltr">
        {study.doi}
      </a>,
      true
    );
  }
  if (study.report_number) addFact(labels.reportNumber, <bdi>{study.report_number}</bdi>);
  if (study.series_number) addFact(labels.seriesNumber, <bdi>{study.series_number}</bdi>);
  if (study.category_name) addFact(labels.category, study.category_name);
  if (typeLabel) addFact(labels.type, typeLabel);
  addFact(labels.access, study.is_premium ? labels.accessPremium : labels.accessFree);
  addFact(labels.language, languageName);
  return (
    <header className={styles.header}>
      <div className={styles.chips}>
        {typeLabel && <span className={styles.chipType}>{typeLabel}</span>}
        {study.category_name && <span className={styles.chip}>{study.category_name}</span>}
        <span className={study.is_premium ? styles.chipPremium : styles.chipFree}>
          {study.is_premium ? labels.accessPremium : labels.accessFree}
        </span>
      </div>

      <h1 className={styles.title}>{study.title}</h1>

      {study.author && (
        <p className={styles.author}>
          <span className={styles.authorAvatar} aria-hidden="true">
            {authorInitial(study.author)}
          </span>
          <span>
            <span className={styles.authorBy}>{labels.by}</span> <span className={styles.authorName}>{study.author}</span>
          </span>
        </p>
      )}

      <div className={styles.actions}>
        {pdfUrl && (
          <a href={pdfUrl} className={styles.pdfButton} target="_blank" rel="noopener noreferrer">
            {labels.downloadPdf}
          </a>
        )}
        <ShareBar url={shareUrl} title={study.title} labels={shareLabels} />
      </div>

      <div className={styles.body}>
        {study.description && (
          <section className={styles.abstract} aria-labelledby="study-abstract-title">
            <h2 id="study-abstract-title" className={styles.sectionTitle}>
              {labels.abstract}
            </h2>
            <p className={styles.abstractText}>{study.description}</p>
          </section>
        )}

        <section className={styles.info} aria-labelledby="study-info-title">
          <h2 id="study-info-title" className={styles.sectionTitle}>
            {labels.studyInfo}
          </h2>
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.term} className={`${styles.fact} ${fact.stacked ? styles.factStacked : ""}`}>
                <dt>{fact.term}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </header>
  );
}
