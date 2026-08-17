const { slugify } = require("../../utils/slugify");
const { sanitizeRichText } = require("../../utils/sanitizeRichText");

const STATUSES = ["draft", "published"];

function validateStudyPayload(body, { partial = false } = {}) {
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
    value.description = String(body.description).trim().slice(0, 500);
  }

  if (body.content_intro !== undefined) {
    value.content_intro = sanitizeRichText(body.content_intro);
  }

  if (body.content_body !== undefined) {
    value.content_body = sanitizeRichText(body.content_body);
  }

  if (body.category_id !== undefined) {
    const categoryId = Number(body.category_id);
    value.category_id = Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null;
  }

  if (!partial || body.status !== undefined) {
    const status = STATUSES.includes(body.status) ? body.status : "draft";
    value.status = status;
  }

  if (body.is_premium !== undefined) {
    value.is_premium = body.is_premium === "true" || body.is_premium === true || body.is_premium === "1";
  }

  if (body.price !== undefined) {
    const price = Number(body.price);
    value.price = Number.isFinite(price) && price >= 0 ? price : null;
  }

  if (body.currency !== undefined && String(body.currency).trim() !== "") {
    value.currency = String(body.currency).trim().slice(0, 6).toUpperCase();
  }

  return { errors, value };
}

module.exports = { validateStudyPayload, STATUSES };
