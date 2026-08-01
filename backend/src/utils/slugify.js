function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 250);
}

module.exports = { slugify };
