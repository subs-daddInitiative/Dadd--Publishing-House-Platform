// Turns one "المحتوى" cell (a small "label: value" per line format — see
// study_import_template.xlsx) into the fields a content block needs.

const ARABIC_TYPE_MAP = {
  "نص": "text",
  "صورة": "image",
  "صورة+نص": "image_text",
  "اقتباس": "quote",
  pdf: "pdf",
  PDF: "pdf",
  "صوت": "voice",
  "فيديو": "video",
  "وسوم": "tags",
};

function resolveType(rawType) {
  const trimmed = typeof rawType === "string" ? rawType.trim() : "";
  return ARABIC_TYPE_MAP[trimmed] || null;
}

// "رابط: https://..." -> { "رابط": "https://..." }. Only splits on the
// FIRST colon so a URL containing "://" doesn't get truncated.
function parseLabelledLines(content) {
  const fields = {};
  const text = typeof content === "string" ? content : "";
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;
    const label = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (label) fields[label] = value;
  }
  return fields;
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Plain text (possibly multiple lines) -> one <p> per non-empty line, since
// the "text"/"image_text" blocks store rich HTML, not plain strings.
function wrapAsHtml(content) {
  const text = typeof content === "string" ? content : "";
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

function parseTags(content) {
  const text = typeof content === "string" ? content : "";
  return text
    .split(/[,،]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

// Reads the duplicate-handling options sent alongside the uploaded files:
// duplicates = "overwrite" (anything else means "ask"), only = JSON array of row ids.
function parseImportOptions(body = {}) {
  const duplicates = body.duplicates === "overwrite" ? "overwrite" : "ask";
  let only = null;
  if (typeof body.only === "string" && body.only) {
    try {
      const ids = JSON.parse(body.only);
      if (Array.isArray(ids)) only = new Set(ids.map(String));
    } catch {
      only = null;
    }
  }
  return { duplicates, only };
}

module.exports = { resolveType, parseLabelledLines, wrapAsHtml, parseTags, parseImportOptions };
