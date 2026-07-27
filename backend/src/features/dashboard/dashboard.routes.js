const { Router } = require("express");
const { pool } = require("../../config/db");

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

router.get("/db-status", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ success: true, data: { database: "connected" } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
