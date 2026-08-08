import type { Dictionary } from "@/i18n/getDictionary";
import type { SocialLink } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { FloatingShapes } from "@/components/FloatingShapes";
import { ContactForm } from "./ContactForm";
import { PhoneIcon, WhatsappIcon } from "./icons";
import { PLATFORM_LABELS, PLATFORM_ICONS } from "@/components/socialPlatforms";
import styles from "./home.module.css";

type ContactProps = {
  dictionary: Dictionary;
  callNumber: string | null;
  whatsappNumber: string | null;
  socialLinks: SocialLink[];
};

export function Contact({ dictionary, callNumber, whatsappNumber, socialLinks }: ContactProps) {
  return (
    <section className={styles.sectionAlt}>
      <FloatingShapes />
      <div className="container">
        <Reveal className={styles.contactHeader}>
          <h2 className={styles.contactTitle}>{dictionary.home.contactTitle}</h2>
          <p className={styles.contactIntro}>{dictionary.home.contactIntro}</p>
        </Reveal>

        <div className={styles.contactGrid}>
          <Reveal className={styles.contactInfoCol} delay={100}>
            {(callNumber || whatsappNumber) && (
              <div className={`${styles.contactInfoCard} hover-lift`}>
                <h3 className={styles.contactInfoTitle}>{dictionary.home.contactInfoTitle}</h3>

                {callNumber && (
                  <a href={`tel:${callNumber}`} className={styles.contactInfoRow}>
                    <span className={styles.contactIconAvatar}>
                      <PhoneIcon className={styles.contactIcon} />
                    </span>
                    <span>
                      <span className={styles.contactLabel}>{dictionary.home.callLabel}</span>
                      <span className={styles.contactValue}>{callNumber}</span>
                    </span>
                  </a>
                )}

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`}
                    className={styles.contactInfoRow}
                  >
                    <span className={styles.contactIconAvatar}>
                      <WhatsappIcon className={styles.contactIcon} />
                    </span>
                    <span>
                      <span className={styles.contactLabel}>{dictionary.home.whatsappLabel}</span>
                      <span className={styles.contactValue}>{whatsappNumber}</span>
                    </span>
                  </a>
                )}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className={styles.contactSocialBlock}>
                <span className={styles.contactLabel}>{dictionary.home.followLabel}</span>
                <div className={styles.socialIcons}>
                  {socialLinks.map((link) => {
                    const Icon = PLATFORM_ICONS[link.platform];
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        className={`${styles.socialIconLink} hover-lift`}
                        aria-label={PLATFORM_LABELS[link.platform] || link.platform}
                      >
                        {Icon ? <Icon className={styles.contactIcon} /> : link.platform.charAt(0).toUpperCase()}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </Reveal>

          <Reveal className={styles.contactFormCol} delay={200}>
            <ContactForm dictionary={dictionary} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
