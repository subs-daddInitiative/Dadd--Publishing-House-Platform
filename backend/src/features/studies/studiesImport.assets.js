// Downloads a remote asset (referenced by URL in an import spreadsheet) into
// the same uploads/ layout the manual block editor writes to, so imported
// studies render exactly like manually-created ones (backendAssetUrl always
// prefixes stored paths with the backend origin, so an external URL can
// never be stored directly on a block).
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const uploadsRoot = path.join(__dirname, "..", "..", "..", "uploads");

const IMAGE_MIME = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" };
const PDF_MIME = { "application/pdf": ".pdf" };
const AUDIO_MIME = { "audio/mpeg": ".mp3", "audio/mp4": ".m4a", "audio/wav": ".wav", "audio/ogg": ".ogg" };
const VIDEO_MIME = { "video/mp4": ".mp4", "video/webm": ".webm", "video/ogg": ".ogv" };

const IMAGE_MAX = 5 * 1024 * 1024;
const OTHER_MAX = 25 * 1024 * 1024;

async function downloadAsset(url, mimeMap, destDir, maxBytes) {
  if (!url || typeof url !== "string" || !/^https?:\/\//i.test(url.trim())) {
    return { error: "لا يوجد رابط صالح (يجب أن يبدأ بـ http:// أو https://)" };
  }

  let response;
  try {
    response = await fetch(url.trim());
  } catch {
    return { error: "تعذر تنزيل الملف من الرابط المحدد" };
  }
  if (!response.ok) {
    return { error: `تعذر تنزيل الملف (رمز الاستجابة ${response.status})` };
  }

  const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const ext = mimeMap[contentType];
  if (!ext) {
    return { error: `نوع الملف غير مدعوم (${contentType || "غير معروف"})` };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > maxBytes) {
    return { error: `حجم الملف يتجاوز الحد المسموح به (${maxBytes === IMAGE_MAX ? "5" : "25"} ميجابايت)` };
  }

  const fullDir = path.join(uploadsRoot, destDir);
  fs.mkdirSync(fullDir, { recursive: true });
  const filename = `${crypto.randomUUID()}${ext}`;
  fs.writeFileSync(path.join(fullDir, filename), buffer);

  return { path: `/uploads/${destDir}/${filename}` };
}

const downloadCoverImage = (url) => downloadAsset(url, IMAGE_MIME, "studies", IMAGE_MAX);
const downloadBlockImage = (url) => downloadAsset(url, IMAGE_MIME, "studies-blocks/images", IMAGE_MAX);
const downloadBlockPdf = (url) => downloadAsset(url, PDF_MIME, "studies-blocks/pdfs", OTHER_MAX);
const downloadBlockAudio = (url) => downloadAsset(url, AUDIO_MIME, "studies-blocks/audio", OTHER_MAX);
const downloadBlockVideo = (url) => downloadAsset(url, VIDEO_MIME, "studies-blocks/videos", OTHER_MAX);

module.exports = {
  downloadCoverImage,
  downloadBlockImage,
  downloadBlockPdf,
  downloadBlockAudio,
  downloadBlockVideo,
};
