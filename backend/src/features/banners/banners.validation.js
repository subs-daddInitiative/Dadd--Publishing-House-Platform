function validateBannerPayload(body) {
  const errors = [];

  const title = body.title !== undefined ? String(body.title).trim().slice(0, 190) : null;
  const description =
    body.description !== undefined ? String(body.description).trim().slice(0, 500) : null;
  const linkUrl = body.link_url !== undefined ? String(body.link_url).trim().slice(0, 255) : null;
  const isActive = body.is_active === undefined ? true : Boolean(Number(body.is_active));
  const sortOrder = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0;

  if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
    errors.push("Link URL must start with http:// or https://");
  }

  const placement = ["hero", "subscription_offers"].includes(body.placement) ? body.placement : "hero";

  return {
    errors,
    value: {
      title,
      description,
      link_url: linkUrl || null,
      placement,
      is_active: isActive,
      sort_order: sortOrder,
      starts_at: body.starts_at || null,
      ends_at: body.ends_at || null,
    },
  };
}

module.exports = { validateBannerPayload };
