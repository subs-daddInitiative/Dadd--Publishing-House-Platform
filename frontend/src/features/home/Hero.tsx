import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import type { PublicStats } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { Parallax } from "@/components/Parallax";
import styles from "./home.module.css";
import heroBook from "../../../public/whyloaydontread.png"

type HeroProps = {
  locale: Locale;
  dictionary: Dictionary;
  brandName: string;
  stats: PublicStats | null;
};

export function Hero({ locale, dictionary, brandName, stats }: HeroProps) {
  const [firstWord = "", ...restWords] = dictionary.home.heroTitle.split(" ");
  const accentWords = restWords.join(" ");

  return (
    <section className={styles.heroWrap}>
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <div className={styles.heroBlobPrimary} aria-hidden="true" />
      <div className={styles.heroBlobSecondary} aria-hidden="true" />
      <span className={styles.heroWatermark} aria-hidden="true">{firstWord.charAt(0)}</span>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroTextCol}>
          <Reveal className={styles.heroTagline}>{dictionary.home.heroBadge}</Reveal>
          <Reveal delay={100}>
            <h1 className={styles.brandName}>
              {firstWord}
              {accentWords && (
                <>
                  <br />
                  <span className={styles.brandNameAccent}>{accentWords}</span>
                </>
              )}
            </h1>
          </Reveal>
          <Reveal as="p" className={styles.heroSubtitle} delay={250}>
            {dictionary.home.heroSubtitle}
          </Reveal>
          <Reveal className={styles.actions} delay={400}>
            <Link href={`/${locale}/books`} className={`${styles.primaryAction} hover-lift`}>
              {dictionary.home.exploreBooks}
            </Link>
            <Link href={`/${locale}/studies`} className={`${styles.secondaryAction} hover-lift`}>
              {dictionary.home.readStudies}
            </Link>
          </Reveal>

          {stats && (
            <Reveal className={styles.heroStatsRow} delay={500}>
              <span className={styles.heroStatItem}>
                <span className={styles.heroStatValue}><CountUp value={stats.books} /></span>
                <span className={styles.heroStatLabel}>{dictionary.home.statsBooks}</span>
              </span>
              <span className={styles.heroStatDivider} aria-hidden="true" />
              <span className={styles.heroStatItem}>
                <span className={styles.heroStatValue}><CountUp value={stats.studies} /></span>
                <span className={styles.heroStatLabel}>{dictionary.home.statsStudies}</span>
              </span>
              <span className={styles.heroStatDivider} aria-hidden="true" />
              <span className={styles.heroStatItem}>
                <span className={styles.heroStatValue}><CountUp value={stats.blogs} /></span>
                <span className={styles.heroStatLabel}>{dictionary.home.statsBlogs}</span>
              </span>
            </Reveal>
          )}
        </div>

        <Reveal className={styles.heroVisualCol} delay={250}>
          <span className={styles.heroStackPanelBack} aria-hidden="true" />
          <span className={styles.heroStackPanelMid} aria-hidden="true" />
          <Parallax speed={0.08}>
            <div className={styles.heroCard}>
              <Image src={heroBook} alt={brandName} fill priority className={styles.heroCardLogo} />
            </div>
          </Parallax>
          <span className={styles.heroBadge}>{dictionary.home.heroBadge}</span>
        </Reveal>
      </div>
    </section>
  );
}
