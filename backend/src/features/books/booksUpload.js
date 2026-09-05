const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const IMAGE_MIME_TYPES = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

const PDF_MIME_TYPES = {
  "application/pdf": ".pdf",
};

// Multer-level backstop only — the real per-type caps (images 5MB, PDF 25MB)
// are enforced by the enforceMediaLimits middleware after upload.
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const imagesDir = path.join(__dirname, "..", "..", "..", "uploads", "books");
const pdfsDir = path.join(__dirname, "..", "..", "..", "uploads", "books-pdfs");
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(pdfsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.fieldname === "cover_image" ? imagesDir : pdfsDir);
  },
  filename: (req, file, cb) => {
    const mimeTypes = file.fieldname === "cover_image" ? IMAGE_MIME_TYPES : PDF_MIME_TYPES;
    const extension = mimeTypes[file.mimetype];
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const booksUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const mimeTypes = file.fieldname === "cover_image" ? IMAGE_MIME_TYPES : PDF_MIME_TYPES;
    if (!mimeTypes[file.mimetype]) {
      return cb(
        new Error(
          file.fieldname === "cover_image"
            ? "Only PNG, JPEG, or WEBP images are allowed"
            : "Only PDF files are allowed"
        )
      );
    }
    cb(null, true);
  },
});

module.exports = { booksUpload };
