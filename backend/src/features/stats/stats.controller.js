const { getContentCounts } = require("./stats.repository");

async function getPublicStats(req, res, next) {
  try {
    const counts = await getContentCounts();
    res.json({ success: true, data: counts });
  } catch (error) {
    next(error);
  }
}

module.exports = { getPublicStats };
