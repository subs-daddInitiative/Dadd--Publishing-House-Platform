import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./Footer.module.css";

type FooterProps = {
  dictionary: Dictionary;
};

export function Footer({ dictionary }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          © {new Date().getFullYear()} {dictionary.common.siteName} —{" "}
          {dictionary.footer.rights}
        </p>
      </div>
    </footer>
  );
}
