import { extractTableOfContents } from "./tableOfContents";
import type { StudyContentBlock } from "@/lib/serverApi";
import styles from "./StudyTableOfContents.module.css";

type StudyTableOfContentsProps = {
  blocks: StudyContentBlock[];
  title: string;
};

export function StudyTableOfContents({ blocks, title }: StudyTableOfContentsProps) {
  const entries = extractTableOfContents(blocks);
  if (entries.length === 0) return null;

  return (
    <nav className={styles.toc} aria-label={title}>
      <h2 className={styles.tocTitle}>{title}</h2>
      <ol className={styles.tocList}>
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} className={styles.tocLink}>
              <span className={styles.tocIndex}>{index + 1}</span>
              <span>{entry.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
