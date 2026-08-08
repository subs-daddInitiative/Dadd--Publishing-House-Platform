const sanitizeHtml = require("sanitize-html");

const SANITIZE_OPTIONS = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

function sanitizeRichText(html) {
  return sanitizeHtml(String(html), SANITIZE_OPTIONS);
}

module.exports = { sanitizeRichText };
