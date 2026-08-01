const UNIT_MS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

function parseDurationToMs(duration, fallbackMs = 24 * 60 * 60 * 1000) {
  const match = /^(\d+)([smhd])$/.exec(String(duration).trim());
  if (!match) return fallbackMs;
  const [, amount, unit] = match;
  return Number(amount) * UNIT_MS[unit];
}

module.exports = { parseDurationToMs };
