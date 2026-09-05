const { REQUEST_TYPES } = require("./joinRequests.repository");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTEREST_AREAS = [
  "childrens_literature",
  "translation",
  "writing",
  "proofreading",
  "research",
  "design",
  "audio",
  "wikipedia",
  "web_development",
  "digital_marketing",
  "coordination",
  "partnerships",
  "donations",
  "other",
];

function validateJoinRequestPayload(body) {
  const errors = [];

  const requestType = REQUEST_TYPES.includes(body.request_type) ? body.request_type : "volunteer";

  const fullName = typeof body.full_name === "string" ? body.full_name.trim().slice(0, 150) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 190) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";
  const location = typeof body.location === "string" ? body.location.trim().slice(0, 150) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";

  if (!fullName) errors.push("Full name is required");
  if (!email || !EMAIL_PATTERN.test(email)) errors.push("A valid email is required");

  if (!body.privacy_accepted) {
    errors.push("You must accept the privacy policy and terms");
  }

  let participationType = null;
  let institutionName = null;
  let institutionType = null;
  let institutionWebsite = null;
  let interestAreasJson = null;

  if (requestType === "volunteer") {
    participationType = body.participation_type === "institution" ? "institution" : "individual";

    if (participationType === "institution") {
      institutionName = typeof body.institution_name === "string" ? body.institution_name.trim().slice(0, 190) : "";
      if (!institutionName) errors.push("Institution name is required");
      institutionType =
        typeof body.institution_type === "string" ? body.institution_type.trim().slice(0, 100) || null : null;
      institutionWebsite =
        typeof body.institution_website === "string" ? body.institution_website.trim().slice(0, 255) || null : null;
    }

    const rawAreas = Array.isArray(body.interest_areas) ? body.interest_areas : [];
    const interestAreas = rawAreas.filter((area) => INTEREST_AREAS.includes(area));
    interestAreasJson = JSON.stringify(interestAreas);
  } else if (!message) {
    errors.push("Message is required");
  }

  return {
    errors,
    value: {
      request_type: requestType,
      participation_type: participationType,
      institution_name: institutionName || null,
      institution_type: institutionType,
      institution_website: institutionWebsite,
      full_name: fullName,
      email,
      phone: phone || null,
      location: location || null,
      interest_areas: interestAreasJson,
      message: message || null,
      newsletter_opt_in: body.newsletter_opt_in ? 1 : 0,
    },
  };
}

module.exports = { validateJoinRequestPayload, INTEREST_AREAS };
