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

const IMAGE_FIELDS = ["cover_image", "main_image"];
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const imagesDir = path.join(__dirname, "..", "..", "..", "uploads", "studies");
const pdfsDir = path.join(__dirname, "..", "..", "..", "uploads", "studies-pdfs");
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(pdfsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGE_FIELDS.includes(file.fieldname) ? imagesDir : pdfsDir);
  },
  filename: (req, file, cb) => {
    const mimeTypes = IMAGE_FIELDS.includes(file.fieldname) ? IMAGE_MIME_TYPES : PDF_MIME_TYPES;
    const extension = mimeTypes[file.mimetype];
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const studiesUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const mimeTypes = IMAGE_FIELDS.includes(file.fieldname) ? IMAGE_MIME_TYPES : PDF_MIME_TYPES;
    if (!mimeTypes[file.mimetype]) {
      return cb(
        new Error(
          IMAGE_FIELDS.includes(file.fieldname)
            ? "Only PNG, JPEG, or WEBP images are allowed"
            : "Only PDF files are allowed"
        )
      );
    }
    cb(null, true);
  },
});

module.exports = { studiesUpload };
