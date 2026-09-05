const TARGETS = ["all", "guest", "reader", "writer"];

function validateAdPayload(body) {
  const errors = [];

  const title = typeof body.title === "string" ? body.title.trim().slice(0, 190) : "";
  if (!title) errors.push("Title is required");

  const message = body.message !== undefined ? String(body.message).trim().slice(0, 500) : null;
  const linkUrl = body.link_url !== undefined ? String(body.link_url).trim().slice(0, 255) : null;
  const linkLabel = body.link_label !== undefined ? String(body.link_label).trim().slice(0, 100) : null;

  if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
    errors.push("Link URL must start with http:// or https://");
  }

  const target = TARGETS.includes(body.target) ? body.target : "all";
  const isActive = body.is_active === false || body.is_active === "0" || body.is_active === 0 ? 0 : 1;
  const sortOrder = Number(body.sort_order);

  return {
    errors,
    value: {
      title,
      message: message || null,
      link_url: linkUrl || null,
      link_label: linkLabel || null,
      target,
      is_active: isActive,
      sort_order: Number.isInteger(sortOrder) && sortOrder >= 0 ? sortOrder : 0,
      starts_at: body.starts_at || null,
      ends_at: body.ends_at || null,
    },
  };
}

module.exports = { validateAdPayload };
