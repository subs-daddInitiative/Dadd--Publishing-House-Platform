function validateAboutFeaturePayload(body, { partial = false } = {}) {
  const errors = [];
  const value = {};

  if (!partial || body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) errors.push("Title is required");
    value.title = title;
  }

  if (body.icon !== undefined) {
    value.icon = String(body.icon).trim().slice(0, 20);
  }

  if (body.description !== undefined) {
    value.description = String(body.description).trim().slice(0, 500);
  }

  if (body.sort_order !== undefined) {
    const sortOrder = Number(body.sort_order);
    value.sort_order = Number.isInteger(sortOrder) && sortOrder >= 0 ? sortOrder : 0;
  }

  return { errors, value };
}

module.exports = { validateAboutFeaturePayload };
