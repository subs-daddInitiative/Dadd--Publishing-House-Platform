const fs = require("fs/promises");
const sharp = require("sharp");

const COMPRESSIBLE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;
const PNG_COMPRESSION_LEVEL = 9;

async function compressFile(file) {
  if (!file || !COMPRESSIBLE_MIME_TYPES.has(file.mimetype)) return;

  let pipeline = sharp(file.path)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });

  if (file.mimetype === "image/jpeg") {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (file.mimetype === "image/webp") {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY });
  } else if (file.mimetype === "image/png") {
    pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION_LEVEL, palette: true });
  }

  const buffer = await pipeline.toBuffer();
  // Write to a temp file and rename over the original — writing back to the
  // same path sharp just read from can fail on Windows with EBUSY/UNKNOWN
  // while the read handle is still settling.
  const tempPath = `${file.path}.tmp`;
  await fs.writeFile(tempPath, buffer);
  await fs.rename(tempPath, file.path);
  file.size = buffer.length;
}

/**
 * Runs after a multer upload middleware (single/fields/array). Re-encodes any
 * uploaded PNG/JPEG/WEBP file in place, capped to MAX_DIMENSION and recompressed;
 * non-image files (PDF/audio/video) pass through untouched.
 */
function compressImages(req, res, next) {
  const files = [];
  if (req.file) files.push(req.file);
  if (req.files) {
    if (Array.isArray(req.files)) {
      files.push(...req.files);
    } else {
      Object.values(req.files).forEach((group) => files.push(...group));
    }
  }

  Promise.all(files.map(compressFile))
    .then(() => next())
    .catch(next);
}

module.exports = { compressImages };
