// Shared helper for computing a trial/subscription expiry date from an
// admin-configured { duration_value, duration_unit } pair. Reused by the
// writer beginner-tier trial and the reader content trials.

const DURATION_UNITS = ["day", "week", "month"];

function computeExpiry(value, unit, from = new Date()) {
  const amount = Number(value) || 0;
  const result = new Date(from);

  if (unit === "day") {
    result.setDate(result.getDate() + amount);
  } else if (unit === "week") {
    result.setDate(result.getDate() + amount * 7);
  } else {
    result.setMonth(result.getMonth() + amount);
  }

  return result;
}

module.exports = { computeExpiry, DURATION_UNITS };
