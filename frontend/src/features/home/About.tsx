import Image from "next/image";
import type { Dictionary } from "@/i18n/getDictionary";
import { Reveal } from "@/components/Reveal";
import styles from "./home.module.css";

type AboutProps = {
  dictionary: Dictionary;
  aboutText: string | null;
  logoUrl: string | null;
  brandName: string;
};

export function About({ dictionary, aboutText, logoUrl, brandName }: AboutProps) {
  return (
    <section className={styles.sectionAlt}>
      <div className={`container ${styles.aboutGrid}`}>
        <Reveal className={styles.aboutTextCol}>
          <h2 className={styles.aboutTitle}>{dictionary.home.aboutTitle}</h2>
          <p className={styles.aboutText}>{aboutText || dictionary.home.aboutFallback}</p>
        </Reveal>
        <Reveal className={styles.aboutImageCol} delay={150}>
          {logoUrl ? (
            <Image src={logoUrl} alt={brandName} width={220} height={220} className={`${styles.aboutLogo} hover-lift`} />
          ) : (
            <div className={`${styles.aboutLogoPlaceholder} hover-lift`} aria-hidden="true">
              {brandName.charAt(0)}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
