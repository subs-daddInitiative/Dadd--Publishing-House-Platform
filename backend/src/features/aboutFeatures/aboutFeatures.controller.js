const { listActive, findById, create, update, softDelete } = require("./aboutFeatures.repository");
const { validateAboutFeaturePayload } = require("./aboutFeatures.validation");

async function getPublicAboutFeatures(req, res, next) {
  try {
    const features = await listActive();
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

module.exports = {
  getPublicAboutFeatures,
  getAdminAboutFeatures,
  createAboutFeatureHandler,
  updateAboutFeatureHandler,
  deleteAboutFeatureHandler,
};
