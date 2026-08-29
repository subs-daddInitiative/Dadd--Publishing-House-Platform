const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const MIME_TYPES = {
  "image/png": { ext: ".png", dir: "blogs-blocks/images" },
  "image/jpeg": { ext: ".jpg", dir: "blogs-blocks/images" },
  "image/webp": { ext: ".webp", dir: "blogs-blocks/images" },
  "application/pdf": { ext: ".pdf", dir: "blogs-blocks/pdfs" },
  "audio/mpeg": { ext: ".mp3", dir: "blogs-blocks/audio" },
  "audio/mp4": { ext: ".m4a", dir: "blogs-blocks/audio" },
  "audio/wav": { ext: ".wav", dir: "blogs-blocks/audio" },
  "audio/ogg": { ext: ".ogg", dir: "blogs-blocks/audio" },
  "video/mp4": { ext: ".mp4", dir: "blogs-blocks/videos" },
  "video/webm": { ext: ".webm", dir: "blogs-blocks/videos" },
  "video/ogg": { ext: ".ogv", dir: "blogs-blocks/videos" },
};

const MAX_FILE_SIZE = 150 * 1024 * 1024;
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
