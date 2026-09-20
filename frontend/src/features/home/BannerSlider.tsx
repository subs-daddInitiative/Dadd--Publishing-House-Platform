"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Banner } from "@/lib/serverApi";
import styles from "./home.module.css";

type BannerSliderProps = {
  banners: Banner[];
  backendUrl: string;
  prevLabel: string;
  nextLabel: string;
  variant?: "hero" | "strip";
};

const AUTO_ADVANCE_MS = 6000;

export function BannerSlider({ banners, backendUrl, prevLabel, nextLabel, variant = "hero" }: BannerSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = (index + banners.length) % banners.length;
      setActiveIndex(nextIndex);
      scrollToIndex(nextIndex);
    },
    [banners.length, scrollToIndex]
  );

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % banners.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [banners.length, scrollToIndex]);

  if (banners.length === 0) return null;

  return (
    <div className={styles.slider}>
      <div className={styles.sliderTrack} ref={trackRef}>
        {banners.map((banner, index) => {
          const slide = (
            <div
              className={`${styles.sliderImageWrap} ${variant === "strip" ? styles.sliderImageWrapStrip : ""}`}
            >
              <Image
                src={`${backendUrl}${banner.image}`}
                alt={banner.title || ""}
                fill
                className={styles.sliderImage}
                sizes="100vw"
                priority={index === 0}
              />
              {banner.title && <p className={styles.sliderCaption}>{banner.title}</p>}
            </div>
          );

          return (
            <div className={styles.sliderSlide} key={banner.id}>
              {banner.link_url ? (
                <a href={banner.link_url} className={styles.sliderLink}>
                  {slide}
                </a>
              ) : (
                slide
              )}
            </div>
          );
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            aria-label={prevLabel}
            className={`${styles.sliderArrow} ${styles.sliderArrowPrev}`}
            onClick={() => goTo(activeIndex - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            className={`${styles.sliderArrow} ${styles.sliderArrowNext}`}
            onClick={() => goTo(activeIndex + 1)}
          >
            ›
          </button>
          <div className={styles.sliderDots}>
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`${index + 1}`}
                className={styles.sliderDot}
                data-active={index === activeIndex}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
