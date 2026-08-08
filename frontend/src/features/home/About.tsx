import type { Dictionary } from "@/i18n/getDictionary";
import type { AboutFeature } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { FloatingShapes } from "@/components/FloatingShapes";
import styles from "./home.module.css";

type AboutProps = {
  dictionary: Dictionary;
  aboutText: string | null;
  features: AboutFeature[];
};

export function About({ dictionary, aboutText, features }: AboutProps) {
  return (
    <section className={styles.sectionAlt}>
      <FloatingShapes />
      <div className="container">
        <Reveal className={styles.aboutIntro}>
          <span className={styles.aboutBadge}>{dictionary.home.aboutBadge}</span>
          <h2 className={styles.aboutHeading}>{dictionary.home.aboutHeading}</h2>
          <p className={styles.aboutText}>{aboutText || dictionary.home.aboutFallback}</p>
        </Reveal>

        {features.length > 0 && (
          <div className={styles.aboutFeaturesGrid}>
            {features.map((feature, index) => (
              <Reveal
                key={feature.id}
                className={`${styles.aboutFeatureCard} hover-lift`}
                delay={index * 120}
              >
                {feature.icon && (
                  <span className={styles.aboutFeatureIcon} aria-hidden="true">
                    {feature.icon}
                  </span>
                )}
                <h3 className={styles.aboutFeatureTitle}>{feature.title}</h3>
                {feature.description && (
                  <p className={styles.aboutFeatureDescription}>{feature.description}</p>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
