const { getSettings, updateSettings } = require("./writerTrial.repository");
const { validateSettingsPayload } = require("./writerTrial.validation");

async function getPublicSettings(req, res, next) {
  try {
    const settings = await getSettings();
    res.json({
      success: true,
      data: {
        is_enabled: settings.is_enabled,
        duration_value: settings.duration_value,
        duration_unit: settings.duration_unit,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminSettings(req, res, next) {
  try {
    const settings = await getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function updateAdminSettings(req, res, next) {
  try {
    const { errors, value } = validateSettingsPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const settings = await updateSettings(value);
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

module.exports = { getPublicSettings, getAdminSettings, updateAdminSettings };
