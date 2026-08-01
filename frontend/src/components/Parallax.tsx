"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of scroll distance to translate by. Small values (0.05–0.15) read as subtle depth, not motion sickness. */
  speed?: number;
};

export function Parallax({ children, className, speed = 0.1 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function update() {
      ticking = false;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
      node.style.transform = `translateY(${distanceFromCenter * -speed}px)`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
