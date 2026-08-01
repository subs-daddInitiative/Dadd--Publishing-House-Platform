import Image from "next/image";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./Footer.module.css";

type FooterProps = {
  dictionary: Dictionary;
  siteName: string;
  logoUrl: string | null;
};

export function Footer({ dictionary, siteName, logoUrl }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {logoUrl && (
          <Image src={logoUrl} alt={siteName} width={32} height={32} className={styles.logo} />
        )}
        <p>
          © {new Date().getFullYear()} {siteName} — {dictionary.footer.rights}
        </p>
      </div>
    </footer>
  );
}
