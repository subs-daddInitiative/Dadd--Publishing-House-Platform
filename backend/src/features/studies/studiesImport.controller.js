const { importStudiesFromWorkbook } = require("./studiesImport.service");

async function importStudiesHandler(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "الرجاء رفع ملف Excel." });
    }

    const result = await importStudiesFromWorkbook(req.file.buffer);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({ success: true, data: result.results });
  } catch (error) {
    if (error.message && /excel|zip|central directory/i.test(error.message)) {
      return res.status(400).json({ success: false, message: "تعذر قراءة الملف — تأكد أنه ملف Excel (.xlsx) صالح." });
    }
    next(error);
  }
}

module.exports = { importStudiesHandler };
