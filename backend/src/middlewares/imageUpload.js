const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const ALLOWED_MIME_TYPES = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function createImageUpload(subfolder) {
  const destination = path.join(__dirname, "..", "..", "uploads", subfolder);
  fs.mkdirSync(destination, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const extension = ALLOWED_MIME_TYPES[file.mimetype];
      cb(null, `${crypto.randomUUID()}${extension}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      if (!ALLOWED_MIME_TYPES[file.mimetype]) {
        return cb(new Error("Only PNG, JPEG, or WEBP images are allowed"));
      }
      cb(null, true);
    },
  });
}

module.exports = { createImageUpload };
