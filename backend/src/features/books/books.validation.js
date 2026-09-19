const { slugify } = require("../../utils/slugify");

const STATUSES = ["draft", "published"];

function parseExternalLinks(raw) {
  if (raw === undefined) return undefined;

  let parsed;
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return { error: "External links must be valid JSON" };
  }

  if (!Array.isArray(parsed)) {
    return { error: "External links must be an array" };
  }

  const links = [];
  for (const entry of parsed) {
    const label = typeof entry?.label === "string" ? entry.label.trim() : "";
    const url = typeof entry?.url === "string" ? entry.url.trim() : "";
    if (!label || !url) continue;
    if (!/^https?:\/\//i.test(url)) {
      return { error: `Invalid external link URL: ${url}` };
    }
    links.push({ label: label.slice(0, 100), url: url.slice(0, 255) });
  }

  return { links };
}

function validateBookPayload(body, { partial = false } = {}) {
  const errors = [];
  const value = {};

  if (!partial || body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) errors.push("Title is required");
    value.title = title;
  }

  if (body.slug !== undefined && String(body.slug).trim() !== "") {
    value.slug = slugify(String(body.slug));
  }

  if (body.author !== undefined) {
    value.author = String(body.author).trim().slice(0, 190);
  }

  if (body.description !== undefined) {
    value.description = String(body.description).trim();
  }

  if (body.price !== undefined) {
    const price = body.price === "" || body.price === null ? null : Number(body.price);
    value.price = price !== null && Number.isFinite(price) && price >= 0 ? price : null;
  }

  if (body.currency !== undefined) {
    const currency = String(body.currency).trim().slice(0, 6);
    value.currency = currency || "USD";
  }

  if (body.pricing_tier_id !== undefined) {
    const tierId = body.pricing_tier_id === "" || body.pricing_tier_id === null ? null : Number(body.pricing_tier_id);
    value.pricing_tier_id = Number.isInteger(tierId) && tierId > 0 ? tierId : null;

    // A tier and a fixed price are mutually exclusive - the tier's price wins.
    if (value.pricing_tier_id) {
      value.price = null;
    }
  }

  if (body.rating !== undefined) {
    const rating = body.rating === "" || body.rating === null ? null : Number(body.rating);
    value.rating = rating !== null && Number.isFinite(rating) && rating >= 0 && rating <= 5 ? rating : null;
  }

  if (body.reviews_count !== undefined) {
    const reviewsCount = Number(body.reviews_count);
    value.reviews_count = Number.isInteger(reviewsCount) && reviewsCount >= 0 ? reviewsCount : 0;
  }

  if (body.category_id !== undefined) {
    const categoryId = Number(body.category_id);
    value.category_id = Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null;
  }

  if (!partial || body.status !== undefined) {
    const status = STATUSES.includes(body.status) ? body.status : "draft";
    value.status = status;
  }

  let externalLinks;
  if (body.external_links !== undefined) {
    const result = parseExternalLinks(body.external_links);
    if (result?.error) {
      errors.push(result.error);
    } else {
      externalLinks = result?.links || [];
    }
  }

  return { errors, value, externalLinks };
}

// Every field is optional here — a book is Arabic content first, so leaving
// a field blank in a translation means "keep showing the Arabic version of
// just that field", not "reject the translation".
function validateBookTranslationPayload(body) {
  const value = {
    title: typeof body.title === "string" ? body.title.trim().slice(0, 255) : "",
    author: typeof body.author === "string" ? body.author.trim().slice(0, 190) : "",
    description: typeof body.description === "string" ? body.description.trim() : "",
  };
  return { errors: [], value };
}

module.exports = { validateBookPayload, validateBookTranslationPayload };
