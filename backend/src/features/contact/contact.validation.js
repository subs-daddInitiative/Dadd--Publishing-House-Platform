const { SUBJECTS } = require("./contact.repository");

function validateContactMessagePayload(body) {
  const errors = [];

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 150) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 190) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : null;
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";

  if (!name) errors.push("Name is required");
  if (!email) errors.push("Email is required");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Email is invalid");
  if (!subject || !SUBJECTS.includes(subject)) {
    errors.push(`Subject must be one of: ${SUBJECTS.join(", ")}`);
  }
  if (!message) errors.push("Message is required");

  return { errors, value: { name, email, phone: phone || null, subject, message } };
}

module.exports = { validateContactMessagePayload };
