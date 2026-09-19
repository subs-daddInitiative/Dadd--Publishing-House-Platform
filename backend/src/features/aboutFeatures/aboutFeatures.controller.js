const {
  listActive,
  findById,
  create,
  update,
  softDelete,
  TRANSLATABLE_LOCALES,
  listTranslations,
  findTranslation,
  upsertTranslation,
  deleteTranslation,
} = require("./aboutFeatures.repository");
const { validateAboutFeaturePayload, validateAboutFeatureTranslationPayload } = require("./aboutFeatures.validation");

async function getPublicAboutFeatures(req, res, next) {
  try {
    const locale = typeof req.query.locale === "string" ? req.query.locale : undefined;
    const features = await listActive(locale);
    res.json({ success: true, data: features });
  } catch (error) {
    next(error);
  }
}

async function getAdminAboutFeatures(req, res, next) {
  try {
    const features = await listActive();
    res.json({ success: true, data: features });
  } catch (error) {
    next(error);
  }
}

async function createAboutFeatureHandler(req, res, next) {
  try {
    const { errors, value } = validateAboutFeaturePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    const feature = await create(value);
    res.status(201).json({ success: true, data: feature });
  } catch (error) {
    next(error);
  }
}

async function updateAboutFeatureHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }
    const { errors, value } = validateAboutFeaturePayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    const updated = await update(req.params.id, value);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteAboutFeatureHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }
    await softDelete(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

function requireValidLocale(req, res) {
  if (!TRANSLATABLE_LOCALES.includes(req.params.locale)) {
    res.status(400).json({ success: false, message: "Unsupported locale" });
    return false;
  }
  return true;
}

async function getFeatureTranslationsHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }
    const translations = await listTranslations(req.params.id);
    res.json({ success: true, data: translations });
  } catch (error) {
    next(error);
  }
}

async function upsertFeatureTranslationHandler(req, res, next) {
  try {
    if (!requireValidLocale(req, res)) return;
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }
    const { errors, value } = validateAboutFeatureTranslationPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    const translation = await upsertTranslation(existing.id, req.params.locale, value);
    res.json({ success: true, data: translation });
  } catch (error) {
    next(error);
  }
}

async function deleteFeatureTranslationHandler(req, res, next) {
  try {
    if (!requireValidLocale(req, res)) return;
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Feature not found" });
    }
    await deleteTranslation(req.params.id, req.params.locale);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicAboutFeatures,
  getAdminAboutFeatures,
  createAboutFeatureHandler,
  updateAboutFeatureHandler,
  deleteAboutFeatureHandler,
  getFeatureTranslationsHandler,
  upsertFeatureTranslationHandler,
  deleteFeatureTranslationHandler,
};
