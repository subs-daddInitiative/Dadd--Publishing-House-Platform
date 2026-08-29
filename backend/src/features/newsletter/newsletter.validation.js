const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignupPayload(body) {
  const errors = [];
  const value = {};

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_PATTERN.test(email)) errors.push("A valid email is required");
  value.email = email.slice(0, 190);

  value.categorySlug = typeof body.category_slug === "string" ? body.category_slug.trim().slice(0, 280) || null : null;
  value.categoryName = typeof body.category_name === "string" ? body.category_name.trim().slice(0, 190) || null : null;
  value.blogSlug = typeof body.blog_slug === "string" ? body.blog_slug.trim().slice(0, 280) || null : null;

  return { errors, value };
}

module.exports = { validateSignupPayload };
