"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import styles from "./blockEditor.module.css";

export type ContentBlock =
  | { id: string; type: "text"; html: string }
  | { id: string; type: "image"; url: string; alt: string; caption: string }
  | { id: string; type: "image_text"; url: string; alt: string; html: string; layout: "image-left" | "image-right" }
  | { id: string; type: "quote"; text: string; author: string }
  | { id: string; type: "tags"; tags: string[] }
  | { id: string; type: "pdf" | "voice"; url: string; label: string; access: "free" | "premium" };

const BLOCK_TYPE_LABELS: Record<ContentBlock["type"], string> = {
  text: "نص",
  image: "صورة",
  image_text: "صورة ونص",
  quote: "اقتباس",
  tags: "وسوم",
  pdf: "ملف PDF",
  voice: "تسجيل صوتي",
};

function createBlock(type: ContentBlock["type"]): ContentBlock {
  const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  switch (type) {
    case "text":
      return { id, type, html: "" };
    case "image":
      return { id, type, url: "", alt: "", caption: "" };
    case "image_text":
      return { id, type, url: "", alt: "", html: "", layout: "image-left" };
    case "quote":
      return { id, type, text: "", author: "" };
    case "tags":
      return { id, type, tags: [] };
    case "pdf":
    case "voice":
      return { id, type, url: "", label: "", access: "free" };
  }
}

type BlockEditorProps = {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  onUploadingChange: (uploading: boolean) => void;
  uploadUrl: string;
};

async function uploadAsset(file: File, uploadUrl: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(uploadUrl, { method: "POST", body: formData });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || "فشل رفع الملف");
  return result.data.url;
}

export function BlockEditor({ blocks, onChange, onUploadingChange, uploadUrl }: BlockEditorProps) {
  const [addType, setAddType] = useState<ContentBlock["type"]>("text");
  const [previews, setPreviews] = useState<Record<string, string>>({});

  function update(id: string, patch: Partial<ContentBlock>) {
    onChange(blocks.map((block) => (block.id === id ? ({ ...block, ...patch } as ContentBlock) : block)));
  }

  function remove(id: string) {
    onChange(blocks.filter((block) => block.id !== id));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const temp = next[index]!;
    next[index] = next[target]!;
    next[target] = temp;
    onChange(next);
  }

  async function handleFileSelect(id: string, file: File) {
    setPreviews((prev) => ({ ...prev, [id]: URL.createObjectURL(file) }));
    onUploadingChange(true);
    try {
      const url = await uploadAsset(file, uploadUrl);
      update(id, { url } as Partial<ContentBlock>);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "فشل رفع الملف");
    } finally {
      onUploadingChange(false);
    }
  }

  return (
    <div>
      {blocks.map((block, index) => (
        <div key={block.id} className={styles.blockCard}>
          <div className={styles.blockHeader}>
            <span className={styles.blockType}>{BLOCK_TYPE_LABELS[block.type]}</span>
            <div className={styles.blockActions}>
              <button type="button" className={styles.blockMoveButton} onClick={() => move(index, -1)} disabled={index === 0}>
                ↑
              </button>
              <button
                type="button"
                className={styles.blockMoveButton}
                onClick={() => move(index, 1)}
                disabled={index === blocks.length - 1}
              >
                ↓
              </button>
              <button type="button" className={styles.blockRemoveButton} onClick={() => remove(block.id)}>
                حذف
              </button>
            </div>
          </div>

          {block.type === "text" && (
            <div className={styles.editorWrap}>
              <RichTextEditor value={block.html} onChange={(html) => update(block.id, { html })} />
            </div>
          )}

          {block.type === "image" && (
            <>
              {(previews[block.id] || block.url) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews[block.id] || block.url} alt="" className={styles.blockImagePreview} />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => event.target.files?.[0] && handleFileSelect(block.id, event.target.files[0])}
              />
              <input
                className={styles.input}
                placeholder="النص البديل (alt)"
                value={block.alt}
                onChange={(event) => update(block.id, { alt: event.target.value })}
              />
              <input
                className={styles.input}
                placeholder="تعليق الصورة (اختياري)"
                value={block.caption}
                onChange={(event) => update(block.id, { caption: event.target.value })}
              />
            </>
          )}

          {block.type === "image_text" && (
            <>
              {(previews[block.id] || block.url) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews[block.id] || block.url} alt="" className={styles.blockImagePreview} />
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => event.target.files?.[0] && handleFileSelect(block.id, event.target.files[0])}
              />
              <input
                className={styles.input}
                placeholder="النص البديل (alt)"
                value={block.alt}
                onChange={(event) => update(block.id, { alt: event.target.value })}
              />
              <select
                className={styles.select}
                value={block.layout}
                onChange={(event) => update(block.id, { layout: event.target.value as "image-left" | "image-right" })}
              >
                <option value="image-left">الصورة يمين النص</option>
                <option value="image-right">الصورة يسار النص</option>
              </select>
              <div className={styles.editorWrap}>
                <RichTextEditor value={block.html} onChange={(html) => update(block.id, { html })} />
              </div>
            </>
          )}

          {block.type === "quote" && (
            <>
              <textarea
                className={styles.textarea}
                placeholder="نص الاقتباس"
                value={block.text}
                onChange={(event) => update(block.id, { text: event.target.value })}
              />
              <input
                className={styles.input}
                placeholder="قائل الاقتباس (اختياري)"
                value={block.author}
                onChange={(event) => update(block.id, { author: event.target.value })}
              />
            </>
          )}

          {block.type === "tags" && (
            <input
              className={styles.input}
              placeholder="أدخل الوسوم مفصولة بفواصل"
              value={block.tags.join(", ")}
              onChange={(event) =>
                update(block.id, { tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })
              }
            />
          )}

          {(block.type === "pdf" || block.type === "voice") && (
            <>
              <input
                type="file"
                accept={block.type === "pdf" ? "application/pdf" : "audio/mpeg,audio/mp4,audio/wav,audio/ogg"}
                onChange={(event) => event.target.files?.[0] && handleFileSelect(block.id, event.target.files[0])}
              />
              {block.url && <p className={styles.itemMeta}>تم رفع الملف بنجاح</p>}
              <input
                className={styles.input}
                placeholder="عنوان الملف (اختياري)"
                value={block.label}
                onChange={(event) => update(block.id, { label: event.target.value })}
              />
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={block.access === "premium"}
                  onChange={(event) => update(block.id, { access: event.target.checked ? "premium" : "free" })}
                />{" "}
                يتطلب اشتراك المدونة المميزة لعرضه
              </label>
            </>
          )}
        </div>
      ))}

      <div className={styles.addBlockRow}>
        <select className={styles.select} value={addType} onChange={(event) => setAddType(event.target.value as ContentBlock["type"])}>
          {Object.entries(BLOCK_TYPE_LABELS).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
        <button type="button" className={styles.buttonSecondary} onClick={() => onChange([...blocks, createBlock(addType)])}>
          إضافة قسم
        </button>
      </div>
    </div>
  );
}
