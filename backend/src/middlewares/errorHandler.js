const multer = require("multer");
const { env } = require("../config/env");

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
}

function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "حجم الملف يتجاوز الحد المسموح به."
        : "تعذر رفع الملف.";
    return res.status(400).json({ success: false, message });
  }

  const status = err.status || 500;

  if (env.nodeEnv !== "test") {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : err.message,
  });
}

module.exports = { notFoundHandler, errorHandler };
