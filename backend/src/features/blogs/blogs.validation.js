const { slugify } = require("../../utils/slugify");
const { sanitizeRichText } = require("../../utils/sanitizeRichText");

const STATUSES = ["draft", "published"];
const BLOCK_TYPES = ["text", "image", "image_text", "quote", "tags", "pdf", "voice", "video"];

function sanitizePlainText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validateBlock(block, index, errors) {
  if (!block || typeof block !== "object" || !BLOCK_TYPES.includes(block.type)) {
    errors.push(`Block ${index + 1}: invalid type`);
    return null;
  }

  const id = typeof block.id === "string" && block.id ? block.id : `block-${index}-${Date.now()}`;

  switch (block.type) {
    case "text":
      return { id, type: "text", html: sanitizeRichText(block.html || "") };
    case "image":
      if (!block.url) {
        errors.push(`Block ${index + 1}: image URL is required`);
        return null;
      }
      return {
        id,
        type: "image",
        url: block.url,
        alt: sanitizePlainText(block.alt, 200),
        caption: sanitizePlainText(block.caption, 300),
      };
    case "image_text":
      if (!block.url) {
        errors.push(`Block ${index + 1}: image URL is required`);
        return null;
      }
      return {
        id,
        type: "image_text",
        url: block.url,
        alt: sanitizePlainText(block.alt, 200),
        html: sanitizeRichText(block.html || ""),
        layout: block.layout === "image-right" ? "image-right" : "image-left",
      };
    case "quote":
      if (!sanitizePlainText(block.text, 1)) {
        errors.push(`Block ${index + 1}: quote text is required`);
        return null;
      }
      return {
        id,
        type: "quote",
        text: sanitizePlainText(block.text, 1000),
        author: sanitizePlainText(block.author, 150),
      };
    case "tags":
      return {
        id,
        type: "tags",
        tags: Array.isArray(block.tags)
          ? block.tags.map((tag) => sanitizePlainText(tag, 50)).filter(Boolean).slice(0, 20)
          : [],
      };
    case "pdf":
    case "voice":
    case "video":
      if (!block.url) {
        errors.push(`Block ${index + 1}: file URL is required`);
        return null;
      }
      return {
        id,
        type: block.type,
        url: block.url,
        label: sanitizePlainText(block.label, 150),
        access: block.access === "premium" ? "premium" : "free",
      };
    default:
      return null;
  }
}

function validateContentBlocks(raw) {
  const errors = [];
  if (!raw) return { errors, blocks: [] };

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { errors: ["content_blocks must be valid JSON"], blocks: [] };
  }

  if (!Array.isArray(parsed)) {
    return { errors: ["content_blocks must be an array"], blocks: [] };
  }

  const blocks = parsed
    .map((block, index) => validateBlock(block, index, errors))
    .filter(Boolean);

  return { errors, blocks };
}

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

  if (body.content_blocks !== undefined) {
    const { errors: blockErrors, blocks } = validateContentBlocks(body.content_blocks);
    errors.push(...blockErrors);
    value.content_blocks = JSON.stringify(blocks);
  }

  if (body.seo_keywords !== undefined) {
    value.seo_keywords = sanitizePlainText(body.seo_keywords, 500);
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

  if (body.is_highlighted !== undefined) {
    value.is_highlighted =
      body.is_highlighted === "true" || body.is_highlighted === true || body.is_highlighted === "1";
  }

  if (body.highlighted_until !== undefined) {
    const raw = String(body.highlighted_until).trim();
    if (!raw) {
      value.highlighted_until = null;
    } else {
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) {
        errors.push("highlighted_until must be a valid date");
      } else {
        value.highlighted_until = date;
      }
    }
  }

  return { errors, value };
}

function validateWriterBlogPayload(body, { partial = false } = {}) {
  const errors = [];
  const value = {};

  if (!partial || body.title !== undefined) {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) errors.push("Title is required");
    value.title = title;
  }

  if (body.excerpt !== undefined) {
    value.excerpt = String(body.excerpt).trim().slice(0, 500);
  }

  if (body.content_blocks !== undefined) {
    const { errors: blockErrors, blocks } = validateContentBlocks(body.content_blocks);
    errors.push(...blockErrors);
    value.content_blocks = JSON.stringify(blocks);
  }

  if (body.category_id !== undefined) {
    const categoryId = Number(body.category_id);
    value.category_id = Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null;
  }

  return { errors, value };
}

function validateTranslationPayload(body) {
  const errors = [];
  const value = {};

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) errors.push("Title is required");
  value.title = title;

  if (body.slug !== undefined && String(body.slug).trim() !== "") {
    value.slug = slugify(String(body.slug));
  }

  if (body.excerpt !== undefined) {
    value.excerpt = String(body.excerpt).trim().slice(0, 500);
  }

  if (body.content_blocks !== undefined) {
    const { errors: blockErrors, blocks } = validateContentBlocks(body.content_blocks);
    errors.push(...blockErrors);
    value.content_blocks = JSON.stringify(blocks);
  }

  if (body.seo_keywords !== undefined) {
    value.seo_keywords = sanitizePlainText(body.seo_keywords, 500);
  }

  return { errors, value };
}

function validateReviewPayload(body) {
  const errors = [];
  const value = {};

  if (!["approved", "rejected"].includes(body.decision)) {
    errors.push("decision must be 'approved' or 'rejected'");
  }
  value.decision = body.decision;

  if (body.decision === "approved") {
    value.isPremium = body.is_premium === true || body.is_premium === "true";
  }

  if (body.decision === "rejected") {
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : "";
    if (!reason) errors.push("A reason is required to reject");
    value.reason = reason;
  }

  return { errors, value };
}

module.exports = {
  validateBlogPayload,
  validateWriterBlogPayload,
  validateReviewPayload,
  validateTranslationPayload,
  validateContentBlocks,
  STATUSES,
  BLOCK_TYPES,
};
