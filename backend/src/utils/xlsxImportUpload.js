const multer = require("multer");

const XLSX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 20;

const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== XLSX_MIME_TYPE) {
      return cb(new Error("يجب أن يكون كل ملف بصيغة Excel (.xlsx)"));
    }
    cb(null, true);
  },
});

module.exports = { importUpload, MAX_FILES };
