const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const MIME_TYPES = {
  "image/png": { ext: ".png", dir: "studies-blocks/images" },
  "image/jpeg": { ext: ".jpg", dir: "studies-blocks/images" },
  "image/webp": { ext: ".webp", dir: "studies-blocks/images" },
  "application/pdf": { ext: ".pdf", dir: "studies-blocks/pdfs" },
  "audio/mpeg": { ext: ".mp3", dir: "studies-blocks/audio" },
  "audio/mp4": { ext: ".m4a", dir: "studies-blocks/audio" },
  "audio/wav": { ext: ".wav", dir: "studies-blocks/audio" },
  "audio/ogg": { ext: ".ogg", dir: "studies-blocks/audio" },
  "video/mp4": { ext: ".mp4", dir: "studies-blocks/videos" },
  "video/webm": { ext: ".webm", dir: "studies-blocks/videos" },
  "video/ogg": { ext: ".ogv", dir: "studies-blocks/videos" },
};

// Multer-level backstop only — the real per-type caps (images 5MB, everything
// else 25MB) are enforced by the enforceMediaLimits middleware after upload.
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const uploadsRoot = path.join(__dirname, "..", "..", "..", "uploads");

for (const { dir } of Object.values(MIME_TYPES)) {
  fs.mkdirSync(path.join(uploadsRoot, dir), { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const config = MIME_TYPES[file.mimetype];
    cb(null, path.join(uploadsRoot, config.dir));
  },
  filename: (req, file, cb) => {
    const config = MIME_TYPES[file.mimetype];
    cb(null, `${crypto.randomUUID()}${config.ext}`);
  },
});

const blockAssetUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!MIME_TYPES[file.mimetype]) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

function assetUrl(file) {
  const config = MIME_TYPES[file.mimetype];
  return `/uploads/${config.dir}/${file.filename}`;
}

module.exports = { blockAssetUpload, assetUrl };
