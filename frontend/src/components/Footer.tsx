import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import type { SocialLink } from "@/lib/serverApi";
import { PhoneIcon, WhatsappIcon } from "@/features/home/icons";
import { PLATFORM_ICONS } from "./socialPlatforms";
import styles from "./Footer.module.css";

type FooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  siteName: string;
  logoUrl: string | null;
  callNumber: string | null;
  whatsappNumber: string | null;
  socialLinks: SocialLink[];
};

export function Footer({
  locale,
  dictionary,
  siteName,
  logoUrl,
  callNumber,
  whatsappNumber,
  socialLinks,
}: FooterProps) {
  const navItems = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/books`, label: dictionary.nav.books },
    { href: `/${locale}/studies`, label: dictionary.nav.studies },
    { href: `/${locale}/blog`, label: dictionary.nav.blog },
    { href: `/${locale}/contact`, label: dictionary.nav.contact },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Link href={`/${locale}`} className={styles.brandLink}>
            {logoUrl && (
              <Image src={logoUrl} alt={siteName} width={40} height={40} className={styles.logo} />
            )}
            <span className={styles.siteName}>{siteName}</span>
          </Link>
          <p className={styles.tagline}>{dictionary.footer.tagline}</p>

          {socialLinks.length > 0 && (
            <div className={styles.socialIcons}>
              {socialLinks.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    className={`${styles.socialIconLink} hover-lift`}
                    aria-label={link.platform}
                  >
                    {Icon ? <Icon className={styles.socialIcon} /> : link.platform.charAt(0).toUpperCase()}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.linksCol}>
          <h3 className={styles.colTitle}>{dictionary.footer.quickLinksTitle}</h3>
          <ul className={styles.linkList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.linksCol}>
          <h3 className={styles.colTitle}>{dictionary.footer.contactTitle}</h3>
          <ul className={styles.linkList}>
            {callNumber && (
              <li>
                <a href={`tel:${callNumber}`} className={styles.footerLink}>
                  <PhoneIcon className={styles.inlineIcon} />
                  {callNumber}
                </a>
              </li>
            )}
            {whatsappNumber && (
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`}
                  className={styles.footerLink}
                >
                  <WhatsappIcon className={styles.inlineIcon} />
                  {whatsappNumber}
                </a>
              </li>
            )}
            <li>
              <Link href={`/${locale}/contact`} className={styles.footerLink}>
                {dictionary.nav.contact}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className="container">
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {siteName} — {dictionary.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
