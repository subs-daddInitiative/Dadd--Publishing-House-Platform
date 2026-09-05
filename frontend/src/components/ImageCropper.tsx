"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import styles from "./ImageCropper.module.css";

type ImageCropperProps = {
  file: File;
  aspectRatio: number;
  title: string;
  hint?: string;
  zoomLabel: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

const MAX_ZOOM = 3;
const OUTPUT_WIDTH = 1600;

export function ImageCropper({
  file,
  aspectRatio,
  title,
  hint,
  zoomLabel,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ImageCropperProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ startX: number; startY: number; startTx: number; startTy: number } | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const baseScale = useMemo(() => {
    if (!natural) return 1;
    const viewport = viewportRef.current;
    if (!viewport) return 1;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    return Math.max(vw / natural.w, vh / natural.h);
  }, [natural, imageUrl]);

  function clamp(tx: number, ty: number, scale: number) {
    const viewport = viewportRef.current;
    if (!viewport || !natural) return { x: tx, y: ty };
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const dw = natural.w * scale;
    const dh = natural.h * scale;
    const minX = Math.min(0, vw - dw);
    const minY = Math.min(0, vh - dh);
    return {
      x: Math.min(0, Math.max(minX, tx)),
      y: Math.min(0, Math.max(minY, ty)),
    };
  }

  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setNatural({ w, h });
    setZoom(1);
    requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const scale = Math.max(viewport.clientWidth / w, viewport.clientHeight / h);
      const centeredX = (viewport.clientWidth - w * scale) / 2;
      const centeredY = (viewport.clientHeight - h * scale) / 2;
      setPos(clamp(centeredX, centeredY, scale));
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    dragState.current = { startX: event.clientX, startY: event.clientY, startTx: pos.x, startTy: pos.y };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current || !natural) return;
    const scale = baseScale * zoom;
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    setPos(clamp(dragState.current.startTx + dx, dragState.current.startTy + dy, scale));
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragState.current = null;
    setIsDragging(false);
  }

  function handleZoomChange(nextZoom: number) {
    if (!natural) {
      setZoom(nextZoom);
      return;
    }
    const viewport = viewportRef.current;
    if (!viewport) {
      setZoom(nextZoom);
      return;
    }
    const oldScale = baseScale * zoom;
    const newScale = baseScale * nextZoom;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    // Keep the point currently at the viewport center fixed while zooming.
    const cx = (vw / 2 - pos.x) / oldScale;
    const cy = (vh / 2 - pos.y) / oldScale;
    const nextX = vw / 2 - cx * newScale;
    const nextY = vh / 2 - cy * newScale;
    setZoom(nextZoom);
    setPos(clamp(nextX, nextY, newScale));
  }

  function handleConfirm() {
    const img = imgRef.current;
    const viewport = viewportRef.current;
    if (!img || !viewport || !natural) return;

    const scale = baseScale * zoom;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;

    const srcX = Math.max(0, -pos.x / scale);
    const srcY = Math.max(0, -pos.y / scale);
    const srcW = Math.min(natural.w - srcX, vw / scale);
    const srcH = Math.min(natural.h - srcY, vh / scale);

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = Math.round(OUTPUT_WIDTH / aspectRatio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/jpeg",
      0.9
    );
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.dialog}>
        <h3 className={styles.title}>{title}</h3>
        {hint && <p className={styles.hint}>{hint}</p>}

        <div
          ref={viewportRef}
          className={styles.viewport}
          style={{ aspectRatio }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          data-dragging={isDragging || undefined}
        >
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={imageUrl}
              alt=""
              draggable={false}
              onLoad={handleImageLoad}
              className={styles.image}
              style={
                natural
                  ? {
                      width: natural.w * baseScale * zoom,
                      height: natural.h * baseScale * zoom,
                      transform: `translate(${pos.x}px, ${pos.y}px)`,
                    }
                  : undefined
              }
            />
          )}
        </div>

        <div className={styles.zoomRow}>
          <span className={styles.zoomLabel}>{zoomLabel}</span>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => handleZoomChange(Number(event.target.value))}
            className={styles.zoomSlider}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={styles.confirmButton} onClick={handleConfirm} disabled={!natural}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
