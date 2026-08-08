import type { CSSProperties } from "react";
import styles from "./FloatingShapes.module.css";

const SHAPES = [
  { type: "circle", top: "8%", left: "6%", size: "3.5rem", duration: "8s", delay: "0s" },
  { type: "dot", top: "18%", left: "24%", size: "0.7rem", duration: "6s", delay: "1.2s" },
  { type: "book", top: "72%", left: "10%", size: "2.75rem", duration: "9s", delay: "2s" },
  { type: "circle", top: "58%", left: "88%", size: "2.5rem", duration: "7s", delay: "0.5s" },
  { type: "dot", top: "12%", left: "82%", size: "0.9rem", duration: "6.5s", delay: "2.5s" },
  { type: "book", top: "38%", left: "93%", size: "2.25rem", duration: "10s", delay: "1s" },
  { type: "dot", top: "86%", left: "45%", size: "0.6rem", duration: "5.5s", delay: "3s" },
  { type: "circle", top: "28%", left: "48%", size: "1.75rem", duration: "8.5s", delay: "1.8s" },
] as const;

export function FloatingShapes() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {SHAPES.map((shape, index) => (
        <span
          key={index}
          className={`${styles.shape} ${styles[shape.type]}`}
          style={
            {
              top: shape.top,
              left: shape.left,
              width: shape.size,
              height: shape.size,
              animationDuration: shape.duration,
              animationDelay: shape.delay,
            } as CSSProperties
          }
        >
          {shape.type === "book" && (
            <svg viewBox="0 0 24 24" fill="none" className={styles.bookIcon}>
              <path
                d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5v-13Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}
