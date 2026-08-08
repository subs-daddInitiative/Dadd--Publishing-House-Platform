const { slugify } = require("../../utils/slugify");
const { sanitizeRichText } = require("../../utils/sanitizeRichText");

const STATUSES = ["draft", "published"];

function validateBlogPayload(body, { partial = false } = {}) {
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

  if (body.author_name !== undefined) {
    value.author_name = String(body.author_name).trim().slice(0, 190);
  }

  if (body.excerpt !== undefined) {
    value.excerpt = String(body.excerpt).trim().slice(0, 500);
  }

  if (body.content !== undefined) {
    value.content = sanitizeRichText(body.content);
  }

  if (body.category_id !== undefined) {
    const categoryId = Number(body.category_id);
    value.category_id = Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null;
  }

  if (!partial || body.status !== undefined) {
    const status = STATUSES.includes(body.status) ? body.status : "draft";
    value.status = status;
  }

  return { errors, value };
}

module.exports = { validateBlogPayload, STATUSES };
