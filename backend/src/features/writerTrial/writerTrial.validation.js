const { DURATION_UNITS } = require("../../utils/trialDuration");

function validateSettingsPayload(body) {
  const errors = [];
  const value = {};

  value.isEnabled = body.is_enabled === true || body.is_enabled === "true" || body.is_enabled === 1 || body.is_enabled === "1";

  const durationValue = Number(body.duration_value);
  if (!Number.isInteger(durationValue) || durationValue < 1 || durationValue > 365) {
    errors.push("duration_value must be an integer between 1 and 365");
  }
  value.durationValue = durationValue;

  if (!DURATION_UNITS.includes(body.duration_unit)) {
    errors.push("duration_unit must be one of day, week, month");
  }
  value.durationUnit = body.duration_unit;

  return { errors, value };
}

module.exports = { validateSettingsPayload };
