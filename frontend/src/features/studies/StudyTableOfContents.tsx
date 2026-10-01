"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { extractTableOfContents, type TableOfContentsEntry } from "./tableOfContents";
import { studyPageHref } from "./studyPageHref";
import type { StudyContentBlock } from "@/lib/serverApi";
import styles from "./StudyTableOfContents.module.css";

type StudyTableOfContentsProps = {
  blocks: StudyContentBlock[];
  title: string;
  basePath: string;
  currentPage: number;
  totalPages: number;
  pageLabel: string;
};

export function StudyTableOfContents({
  blocks,
  title,
  basePath,
  currentPage,
  totalPages,
  pageLabel,
}: StudyTableOfContentsProps) {
  const entries = extractTableOfContents(blocks);
  const currentPageEntries = entries.filter((entry) => entry.page === currentPage);
  const [activeId, setActiveId] = useState<string | null>(currentPageEntries[0]?.id ?? null);

  useEffect(() => {
    // Only the sections on the page being read exist in the DOM.
    const targets = entries
      .filter((entry) => entry.page === currentPage)
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
    // underlying blocks or the visible page actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, currentPage]);

  if (entries.length === 0) return null;

  function renderEntry(entry: TableOfContentsEntry, index: number) {
    const className = `${styles.tocLink} ${entry.id === activeId ? styles.tocLinkActive : ""}`;
    const content = (
      <>
        <span className={styles.tocIndex}>{index + 1}</span>
        <span>{entry.label}</span>
      </>
    );

    return (
      <li key={entry.id}>
        {entry.page === currentPage ? (
          <a href={`#${entry.id}`} className={className}>
            {content}
          </a>
        ) : (
          <Link href={`${studyPageHref(basePath, entry.page)}#${entry.id}`} className={className}>
            {content}
          </Link>
        )}
      </li>
    );
  }

  if (totalPages <= 1) {
    return (
      <nav className={styles.toc} aria-label={title}>
        <h2 className={styles.tocTitle}>{title}</h2>
        <ol className={styles.tocList}>{entries.map(renderEntry)}</ol>
      </nav>
    );
  }

  // Multi-page study: one list, grouped by page. The page being read is open;
  // the others stay collapsed but one click away.
  const pages = [...new Set(entries.map((entry) => entry.page))];

  return (
    <nav className={styles.toc} aria-label={title}>
      <h2 className={styles.tocTitle}>{title}</h2>
      {pages.map((page) => {
        const pageEntries = entries.filter((entry) => entry.page === page);
        return (
          <details key={page} className={styles.tocGroup} open={page === currentPage}>
            <summary className={styles.tocGroupTitle}>
              {pageLabel} {page}
              <span className={styles.tocGroupCount}>{pageEntries.length}</span>
            </summary>
            <ol className={styles.tocList}>
              {pageEntries.map((entry) => renderEntry(entry, entries.indexOf(entry)))}
            </ol>
          </details>
        );
      })}
    </nav>
  );
}
