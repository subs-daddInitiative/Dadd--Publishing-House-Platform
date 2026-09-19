const {
  listActiveForAudience,
  listAll,
  findById,
  createItem,
  updateItem,
  softDeleteItem,
  TRANSLATABLE_LOCALES,
  listTranslations,
  findTranslation,
  upsertTranslation,
  deleteTranslation,
} = require("./newsTicker.repository");
const { validateItemPayload, validateTranslationPayload } = require("./newsTicker.validation");

async function getPublicTicker(req, res, next) {
  try {
    const audience = req.query.audience === "writer" ? "writer" : "reader";
    const locale = typeof req.query.locale === "string" ? req.query.locale : undefined;
    const items = await listActiveForAudience(audience, locale);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function getAdminTicker(req, res, next) {
  try {
    const items = await listAll();
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function createItemHandler(req, res, next) {
  try {
    const { errors, value } = validateItemPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const id = await createItem(value);
    const item = await findById(id);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function updateItemHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "News ticker item not found" });
    }

    const { errors, value } = validateItemPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const updated = await updateItem(req.params.id, value);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteItemHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "News ticker item not found" });
    }
    await softDeleteItem(req.params.id);
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

async function getItemTranslationsHandler(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "News ticker item not found" });
    }
    const translations = await listTranslations(req.params.id);
    res.json({ success: true, data: translations });
  } catch (error) {
    next(error);
  }
}

async function upsertItemTranslationHandler(req, res, next) {
  try {
    if (!requireValidLocale(req, res)) return;
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "News ticker item not found" });
    }
    const { errors, value } = validateTranslationPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    const translation = await upsertTranslation(existing.id, req.params.locale, value);
    res.json({ success: true, data: translation });
  } catch (error) {
    next(error);
  }
}

async function deleteItemTranslationHandler(req, res, next) {
  try {
    if (!requireValidLocale(req, res)) return;
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "News ticker item not found" });
    }
    await deleteTranslation(req.params.id, req.params.locale);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicTicker,
  getAdminTicker,
  createItemHandler,
  updateItemHandler,
  deleteItemHandler,
  getItemTranslationsHandler,
  upsertItemTranslationHandler,
  deleteItemTranslationHandler,
};
