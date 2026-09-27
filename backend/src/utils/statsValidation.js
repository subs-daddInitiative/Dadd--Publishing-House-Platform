// Validates the optional "number + title" stats strip shared by blogs and
// studies (e.g. "500" / "مشارك") — up to 6 pairs, both fields plain text.
const MAX_STATS = 6;
const NUMBER_MAX_LENGTH = 20;
const TITLE_MAX_LENGTH = 60;

function validateStats(raw) {
  if (!raw) return { errors: [], stats: [] };

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { errors: ["stats must be valid JSON"], stats: [] };
  }

  if (!Array.isArray(parsed)) {
    return { errors: ["stats must be an array"], stats: [] };
  }

  const stats = parsed
    .slice(0, MAX_STATS)
    .map((item) => ({
      number: typeof item?.number === "string" ? item.number.trim().slice(0, NUMBER_MAX_LENGTH) : "",
      title: typeof item?.title === "string" ? item.title.trim().slice(0, TITLE_MAX_LENGTH) : "",
    }))
    .filter((item) => item.number || item.title);

  return { errors: [], stats };
}

module.exports = { validateStats, MAX_STATS };
