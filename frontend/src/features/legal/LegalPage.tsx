import styles from "./legal.module.css";

type LegalSection = {
  heading: string;
  body: string;
};

type LegalPageProps = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.updated}>{updated}</p>
      <p className={styles.intro}>{intro}</p>

      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.heading}</h2>
            <p className={styles.sectionBody}>{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
