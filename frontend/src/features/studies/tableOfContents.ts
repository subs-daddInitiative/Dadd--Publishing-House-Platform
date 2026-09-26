import type { StudyContentBlock } from "@/lib/serverApi";

export type TableOfContentsEntry = { id: string; label: string };

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstWords(text: string, count = 8): string {
  const words = text.split(" ").filter(Boolean);
  if (words.length === 0) return "";
  if (words.length <= count) return words.join(" ");
  return `${words.slice(0, count).join(" ")}…`;
}

// Only blocks with real, readable text become a table-of-contents entry —
// plain images/videos and the tags block have nothing meaningful to name a
// section after, so they're skipped rather than showing an empty label.
export function extractTableOfContents(blocks: StudyContentBlock[]): TableOfContentsEntry[] {
  const entries: TableOfContentsEntry[] = [];

  for (const block of blocks) {
    let label = "";

    switch (block.type) {
      case "text":
      case "image_text":
        label = firstWords(stripHtml(block.html));
        break;
      case "quote":
        label = firstWords(block.text);
        break;
      case "pdf":
      case "voice":
        label = firstWords(block.label);
        break;
      default:
        continue;
    }

    if (label) entries.push({ id: block.id, label });
  }

  return entries;
}
