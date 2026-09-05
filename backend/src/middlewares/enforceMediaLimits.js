const fs = require("fs/promises");

const IMAGE_MAX = 5 * 1024 * 1024;
const OTHER_MAX = 25 * 1024 * 1024;

const RULES = [
  { test: (mimetype) => mimetype.startsWith("image/"), max: IMAGE_MAX, label: "5 ميجابايت" },
  { test: (mimetype) => mimetype.startsWith("video/"), max: OTHER_MAX, label: "25 ميجابايت" },
  { test: (mimetype) => mimetype.startsWith("audio/"), max: OTHER_MAX, label: "25 ميجابايت" },
  { test: (mimetype) => mimetype === "application/pdf", max: OTHER_MAX, label: "25 ميجابايت" },
];

function findRule(mimetype) {
  return RULES.find((rule) => rule.test(mimetype));
}

/**
 * Runs after a multer upload middleware. Multer's own `limits.fileSize` is set
 * to the largest size any field on that instance may need (so it doesn't reject
 * a valid video before this runs) — this middleware then enforces the real,
 * per-type caps: images capped at 5MB, everything else (PDF/audio/video) at 25MB.
 */
async function enforceMediaLimits(req, res, next) {
  const files = [];
  if (req.file) files.push(req.file);
  if (req.files) {
    if (Array.isArray(req.files)) {
      files.push(...req.files);
    } else {
      Object.values(req.files).forEach((group) => files.push(...group));
    }
  }

  for (const file of files) {
    const rule = findRule(file.mimetype);
    if (rule && file.size > rule.max) {
      await Promise.all(files.map((f) => fs.unlink(f.path).catch(() => {})));
      return res.status(400).json({
        success: false,
        message: `حجم الملف "${file.originalname}" يتجاوز الحد المسموح به (${rule.label}).`,
      });
    }
  }

  next();
}

module.exports = { enforceMediaLimits };
