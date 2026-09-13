const {
  listActiveForAudience,
  listAll,
  findById,
  createAd,
  updateAd,
  softDeleteAd,
  TRANSLATABLE_LOCALES,
  listTranslations,
  upsertTranslation,
  deleteTranslation,
} = require("./siteAds.repository");
const { validateAdPayload, validateAdTranslationPayload } = require("./siteAds.validation");

const AUDIENCES = ["guest", "reader", "writer"];

async function getPublicAds(req, res, next) {
  try {
    const audience = AUDIENCES.includes(req.query.audience) ? req.query.audience : "guest";
    const locale = typeof req.query.locale === "string" ? req.query.locale : undefined;
    const ads = await listActiveForAudience(audience, locale);
    res.json({ success: true, data: ads });
  } catch (error) {
    next(error);
  }
}

async function getAdminAds(req, res, next) {
  try {
    const ads = await listAll();
    res.json({ success: true, data: ads });
  } catch (error) {
    next(error);
  }
}

async function createAdHandler(req, res, next) {
  try {
    const { errors, value } = validateAdPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const image = req.file ? `/uploads/ads/${req.file.filename}` : null;
    const id = await createAd({ ...value, image });
    const ad = await findById(id);
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
}

async function updateAdHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    const { errors, value } = validateAdPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (req.file) {
      value.image = `/uploads/ads/${req.file.filename}`;
    }

    const updated = await updateAd(req.params.id, value);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteAdHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }
    await softDeleteAd(req.params.id);
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

async function getAdTranslationsHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }
    const translations = await listTranslations(req.params.id);
    res.json({ success: true, data: translations });
  } catch (error) {
    next(error);
  }
}

async function upsertAdTranslationHandler(req, res, next) {
  try {
    if (!requireValidLocale(req, res)) return;
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    const { errors, value } = validateAdTranslationPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const translation = await upsertTranslation(existing.id, req.params.locale, value);
    res.json({ success: true, data: translation });
  } catch (error) {
    next(error);
  }
}

async function deleteAdTranslationHandler(req, res, next) {
  try {
    if (!requireValidLocale(req, res)) return;
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }
    await deleteTranslation(req.params.id, req.params.locale);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicAds,
  getAdminAds,
  createAdHandler,
  updateAdHandler,
  deleteAdHandler,
  getAdTranslationsHandler,
  upsertAdTranslationHandler,
  deleteAdTranslationHandler,
};
