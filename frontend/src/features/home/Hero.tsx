import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/Reveal";
import { StaggerText } from "@/components/StaggerText";
import { Parallax } from "@/components/Parallax";
import { FloatingShapes } from "@/components/FloatingShapes";
import styles from "./home.module.css";
import heroBook from "../../../public/whyloaydontread.png"

type HeroProps = {
  locale: Locale;
  dictionary: Dictionary;
  brandName: string;
};

export function Hero({ locale, dictionary, brandName }: HeroProps) {
  return (
    <section className={styles.heroWrap}>
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <div className={styles.heroBlobPrimary} aria-hidden="true" />
      <div className={styles.heroBlobSecondary} aria-hidden="true" />
      <FloatingShapes />
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroTextCol}>
          <Reveal as="p" className={styles.heroTagline}>
            {dictionary.home.heroTitle}
          </Reveal>
          <StaggerText as="h1" text={brandName} className={styles.brandName} delay={100} />
          <Reveal as="p" className={styles.heroSubtitle} delay={350}>
            {dictionary.home.heroSubtitle}
          </Reveal>
          <Reveal className={styles.actions} delay={500}>
            <Link href={`/${locale}/books`} className={`${styles.primaryAction} hover-lift`}>
              {dictionary.home.exploreBooks}
            </Link>
            <Link href={`/${locale}/studies`} className={`${styles.secondaryAction} hover-lift`}>
              {dictionary.home.readStudies}
            </Link>
          </Reveal>
        </div>

        <Reveal className={styles.heroVisualCol} delay={250}>
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
