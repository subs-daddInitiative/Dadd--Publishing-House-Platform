const {
  listActiveForAudience,
  listAll,
  findById,
  createItem,
  updateItem,
  softDeleteItem,
} = require("./newsTicker.repository");
const { validateItemPayload } = require("./newsTicker.validation");

async function getPublicTicker(req, res, next) {
  try {
    const audience = req.query.audience === "writer" ? "writer" : "reader";
    const items = await listActiveForAudience(audience);
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

module.exports = {
  getPublicTicker,
  getAdminTicker,
  createItemHandler,
  updateItemHandler,
  deleteItemHandler,
};
