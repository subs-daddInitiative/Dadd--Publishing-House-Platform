import type { CSSProperties, ElementType } from "react";
import { Reveal } from "./Reveal";

type StaggerTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
};

/** Splits text into words and reveals them left-to-right as the element
 * scrolls into view. Built on <Reveal bare> — see globals.css .word-stagger. */
export function StaggerText({ text, as = "span", className, delay = 0 }: StaggerTextProps) {
  const words = text.split(" ");

  return (
    <Reveal as={as} className={`word-stagger ${className ?? ""}`} delay={delay} bare>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="word" style={{ "--word-index": index } as CSSProperties}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Reveal>
  );
}
