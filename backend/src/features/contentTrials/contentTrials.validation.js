const { pool } = require("../../config/db");
const { DURATION_UNITS } = require("../../utils/trialDuration");

async function validateCategories(rawCategories, contentType) {
  const errors = [];
  if (!Array.isArray(rawCategories)) {
    return { errors: ["categories must be an array"], categories: [] };
  }
  if (rawCategories.length > 50) {
    errors.push("A trial may reference at most 50 categories");
  }

  const seen = new Set();
  const categories = [];
  for (const entry of rawCategories.slice(0, 50)) {
    const categoryType = entry?.category_type;
    const categoryId = Number(entry?.category_id);
    if (!["blogs", "studies"].includes(categoryType) || !Number.isInteger(categoryId) || categoryId <= 0) {
      errors.push(`Invalid category entry: ${JSON.stringify(entry)}`);
      continue;
    }
    if (contentType && categoryType !== contentType) {
      errors.push(`Category ${categoryType}#${categoryId} does not match the trial's content_type (${contentType})`);
      continue;
    }
    const key = `${categoryType}:${categoryId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    categories.push({ categoryType, categoryId });
  }

  for (const category of categories) {
    const table = category.categoryType === "blogs" ? "blogs_categories" : "studies_categories";
    const [rows] = await pool.query(
      `SELECT id FROM ${table} WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
      [category.categoryId]
    );
    if (rows.length === 0) {
      errors.push(`Category not found: ${category.categoryType}#${category.categoryId}`);
    }
  }

  return { errors, categories };
}

async function validateTrialPayload(body) {
  const errors = [];
  const value = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) errors.push("name is required");
  if (name.length > 190) errors.push("name must be at most 190 characters");
  value.name = name.slice(0, 190);

  if (!["blogs", "studies"].includes(body.content_type)) {
    errors.push("content_type must be one of blogs, studies");
  }
  value.contentType = body.content_type;

  const durationValue = Number(body.duration_value);
  if (!Number.isInteger(durationValue) || durationValue < 1 || durationValue > 365) {
    errors.push("duration_value must be an integer between 1 and 365");
  }
  value.durationValue = durationValue;

  if (!DURATION_UNITS.includes(body.duration_unit)) {
    errors.push("duration_unit must be one of day, week, month");
  }
  value.durationUnit = body.duration_unit;

  value.isActive = body.is_active === false || body.is_active === "0" || body.is_active === 0 ? false : true;

  const sortOrder = Number(body.sort_order);
  value.sortOrder = Number.isInteger(sortOrder) && sortOrder >= 0 ? sortOrder : 0;

  const { errors: categoryErrors, categories } = await validateCategories(body.categories, value.contentType);
  errors.push(...categoryErrors);
  value.categories = categories;

  return { errors, value };
}

module.exports = { validateTrialPayload, validateCategories };
