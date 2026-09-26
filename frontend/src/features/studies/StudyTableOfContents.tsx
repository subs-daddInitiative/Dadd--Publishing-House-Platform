"use client";

import { useEffect, useState } from "react";
import { extractTableOfContents } from "./tableOfContents";
import type { StudyContentBlock } from "@/lib/serverApi";
import styles from "./StudyTableOfContents.module.css";

type StudyTableOfContentsProps = {
  blocks: StudyContentBlock[];
  title: string;
};

export function StudyTableOfContents({ blocks, title }: StudyTableOfContentsProps) {
  const entries = extractTableOfContents(blocks);
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return undefined;

    const targets = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return undefined;

    // Classic scrollspy: the active section is the last one whose top has
    // scrolled past the activation line just below the sticky header.
    const ACTIVATION_OFFSET = 120;
    let ticking = false;

    function updateActive() {
      ticking = false;
      let currentId: string = targets[0]!.id;
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
          currentId = target.id;
        } else {
          break;
        }
      }
      setActiveId(currentId);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    }

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // entries is derived from blocks on every render; re-run only when the
    // underlying blocks actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  if (entries.length === 0) return null;

  return (
    <nav className={styles.toc} aria-label={title}>
      <h2 className={styles.tocTitle}>{title}</h2>
      <ol className={styles.tocList}>
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={`${styles.tocLink} ${entry.id === activeId ? styles.tocLinkActive : ""}`}
            >
              <span className={styles.tocIndex}>{index + 1}</span>
              <span>{entry.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
