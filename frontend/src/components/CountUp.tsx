"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  duration?: number;
  className?: string;
};

const EASE_OUT_EXPO = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function CountUp({ value, duration = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    let frame: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          setDisplay(Math.round(value * EASE_OUT_EXPO(progress)));
          if (progress < 1) {
            frame = requestAnimationFrame(tick);
          }
        }
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
    </span>
  );
}
