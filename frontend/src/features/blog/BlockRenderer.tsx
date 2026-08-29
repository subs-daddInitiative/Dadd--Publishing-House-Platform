import Image from "next/image";
import type { BlogContentBlock } from "@/lib/serverApi";
import { backendAssetUrl } from "@/lib/serverApi";
import styles from "./blog.module.css";

type BlockRendererProps = {
  blocks: BlogContentBlock[];
  lockedFileLabel: string;
};

export function BlockRenderer({ blocks, lockedFileLabel }: BlockRendererProps) {
  return (
    <div className={styles.blocks}>
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return (
              <div
                key={block.id}
                className={styles.postBody}
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            );

          case "image": {
            const url = backendAssetUrl(block.url);
            if (!url) return null;
            return (
              <figure key={block.id}>
                <div className={styles.blockImage}>
                  <Image src={url} alt={block.alt} fill sizes="(max-width: 60rem) 100vw, 42rem" className={styles.postImage} />
                </div>
                {block.caption && <figcaption className={styles.blockImageCaption}>{block.caption}</figcaption>}
              </figure>
            );
          }

          case "image_text": {
            const url = backendAssetUrl(block.url);
            if (!url) return null;
            return (
              <div
                key={block.id}
                className={`${styles.blockImageText} ${block.layout === "image-right" ? styles.blockImageTextReversed : ""}`}
              >
                <div className={styles.blockImage}>
                  <Image src={url} alt={block.alt} fill sizes="(max-width: 40rem) 100vw, 21rem" className={styles.postImage} />
                </div>
                <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: block.html }} />
              </div>
            );
          }

          case "quote":
            return (
              <blockquote key={block.id} className={styles.blockQuote}>
                {block.text}
                {block.author && <cite className={styles.blockQuoteAuthor}>{block.author}</cite>}
              </blockquote>
            );

          case "tags":
            return (
              <div key={block.id} className={styles.blockTags}>
                {block.tags.map((tag) => (
                  <span key={tag} className={styles.blockTag}>
                    #{tag}
                  </span>
                ))}
              </div>
            );

          case "pdf":
          case "voice":
          case "video": {
            if (block.locked || !block.url) {
              return (
                <div key={block.id} className={styles.blockFile}>
                  {block.label && <p className={styles.blockFileLabel}>{block.label}</p>}
                  <p className={styles.blockFileLocked}>{lockedFileLabel}</p>
                </div>
              );
            }
            const url = backendAssetUrl(block.url);
            return (
              <div key={block.id} className={styles.blockFile}>
                {block.label && <p className={styles.blockFileLabel}>{block.label}</p>}
                {block.type === "pdf" ? (
                  <a href={url || undefined} target="_blank" rel="noopener noreferrer">
                    عرض ملف PDF
                  </a>
                ) : block.type === "voice" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <audio controls src={url || undefined} style={{ width: "100%" }} />
                ) : (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video controls src={url || undefined} className={styles.blockVideo} />
                )}
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
