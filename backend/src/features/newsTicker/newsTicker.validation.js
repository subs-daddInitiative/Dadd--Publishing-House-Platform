const TARGETS = ["all", "reader", "writer"];

function validateItemPayload(body) {
  const errors = [];
  const value = {};

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) errors.push("Message is required");
  value.message = message.slice(0, 500);

  const target = TARGETS.includes(body.target) ? body.target : "all";
  value.target = target;

  value.is_active = body.is_active === false || body.is_active === "0" || body.is_active === 0 ? 0 : 1;

  const sortOrder = Number(body.sort_order);
  value.sort_order = Number.isInteger(sortOrder) && sortOrder >= 0 ? sortOrder : 0;

  return { errors, value };
}

module.exports = { validateItemPayload };
