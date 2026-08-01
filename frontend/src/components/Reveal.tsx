"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** "up" slides in from below (default); "none" only fades. */
  direction?: "up" | "none";
  /** When true, don't animate this element itself — just toggle the
   * "is-visible" class so descendant CSS (e.g. word-by-word stagger) can
   * key off it. Used by StaggerText. */
  bare?: boolean;
};

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  direction = "up",
  bare = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties & Record<string, string | number> = {
    "--reveal-delay": `${delay}ms`,
  };

  const revealClass = bare ? "" : direction === "up" ? "reveal reveal-up" : "reveal";

  return (
    <Tag
      ref={ref}
      className={[revealClass, isVisible ? "is-visible" : "", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}
