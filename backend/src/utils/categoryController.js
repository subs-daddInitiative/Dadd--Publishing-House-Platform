function validateCategoryPayload(body, { partial = false } = {}) {
  const errors = [];
  const value = {};

  if (!partial || body.name !== undefined) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) errors.push("Name is required");
    value.name = name;
  }

  if (body.slug !== undefined && String(body.slug).trim() !== "") {
    value.slug = String(body.slug).trim();
  }

  if (body.description !== undefined) {
    value.description = String(body.description).trim().slice(0, 500);
  }

  return { errors, value };
}

/**
 * Generic admin controller (list/create/update/remove) for a category
 * repository created by createCategoryRepository — shared by blogs and
 * studies categories so the CRUD logic isn't duplicated per feature.
 */
function createCategoryController(repository) {
  async function list(req, res, next) {
    try {
      const categories = await repository.list();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async function create(req, res, next) {
    try {
      const { errors, value } = validateCategoryPayload(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
      }
      const category = await repository.create(value);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    try {
      const existing = await repository.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      const { errors, value } = validateCategoryPayload(req.body, { partial: true });
      if (errors.length > 0) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
      }
      const updated = await repository.update(req.params.id, value);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async function remove(req, res, next) {
    try {
      const existing = await repository.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      await repository.softDelete(req.params.id);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }

  return { list, create, update, remove };
}

module.exports = { createCategoryController };
