import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { StudySummary } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { StudyCard } from "@/features/studies/StudyCard";
import studyStyles from "@/features/studies/studies.module.css";
import styles from "./home.module.css";

type StudiesSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  studies: StudySummary[];
};

export function StudiesSection({ locale, dictionary, studies }: StudiesSectionProps) {
  const items = studies.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.highlightHeader}>
          <Reveal>
            <h2 className={styles.highlightTitle}>{dictionary.studiesPage.title}</h2>
            <p className={styles.highlightSubtitle}>{dictionary.studiesPage.subtitle}</p>
          </Reveal>
          <Reveal delay={100}>
            <Link href={`/${locale}/studies`} className={studyStyles.viewAllLink}>
              {dictionary.studiesPage.viewAll}
            </Link>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className={studyStyles.postsList}>
            {items.map((study) => (
              <StudyCard
                key={study.id}
                locale={locale}
                study={study}
                byLabel={dictionary.studiesPage.by}
                favoriteLabel={dictionary.booksPage.favorite}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
