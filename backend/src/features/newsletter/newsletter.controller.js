const { validateSignupPayload } = require("./newsletter.validation");
const { createSignup } = require("./newsletter.repository");

async function subscribe(req, res, next) {
  try {
    const { errors, value } = validateSignupPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    await createSignup(value);
    res.status(201).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { subscribe };
