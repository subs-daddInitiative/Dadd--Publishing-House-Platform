import type { Dictionary } from "@/i18n/getDictionary";
import type { AboutFeature } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import styles from "./home.module.css";

type AboutProps = {
  dictionary: Dictionary;
  aboutText: string | null;
  features: AboutFeature[];
};

export function About({ dictionary, aboutText, features }: AboutProps) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.aboutGrid}`}>
        <Reveal className={styles.aboutIntro}>
          <span className={styles.aboutBadge}>{dictionary.home.aboutBadge}</span>
          <h2 className={styles.aboutHeading}>{dictionary.home.aboutHeading}</h2>
          <p className={styles.aboutText}>{aboutText || dictionary.home.aboutFallback}</p>
        </Reveal>

        {features.length > 0 && (
          <div className={styles.aboutFeaturesList}>
            {features.map((feature, index) => (
              <Reveal key={feature.id} className={styles.aboutFeatureRow} delay={index * 120}>
                <span className={styles.aboutFeatureIndex}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.aboutFeatureBody}>
                  <h3 className={styles.aboutFeatureTitle}>{feature.title}</h3>
                  {feature.description && (
                    <p className={styles.aboutFeatureDescription}>{feature.description}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
