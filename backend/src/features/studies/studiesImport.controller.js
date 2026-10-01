const { parseImportOptions } = require("../../utils/contentImportParse");
const { importStudiesFromWorkbook } = require("./studiesImport.service");

function isBadWorkbookError(error) {
  return Boolean(error.message) && /excel|zip|central directory/i.test(error.message);
}

// Accepts one or more .xlsx files in one request. Each file is processed
// independently — a broken/malformed file doesn't stop the others, it's just
// reported as failed under its own filename in the response, alongside
// whichever studies inside it succeeded or failed.
async function importStudiesHandler(req, res, next) {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "الرجاء رفع ملف Excel واحد أو أكثر." });
    }

    const options = parseImportOptions(req.body);
    const data = [];
    for (const [fileIndex, file] of files.entries()) {
      try {
        const result = await importStudiesFromWorkbook(file.buffer, { ...options, fileIndex });
        if (!result.success) {
          data.push({ filename: file.originalname, success: false, message: result.message });
        } else {
          data.push({ filename: file.originalname, success: true, results: result.results });
        }
      } catch (error) {
        data.push({
          filename: file.originalname,
          success: false,
          message: isBadWorkbookError(error)
            ? "تعذر قراءة الملف — تأكد أنه ملف Excel (.xlsx) صالح."
            : "حدث خطأ غير متوقع أثناء معالجة هذا الملف.",
        });
      }
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = { importStudiesHandler };
