function validateSettingsPayload(body) {
  const errors = [];
  const value = {};

  if (body.site_name !== undefined) {
    const siteName = String(body.site_name).trim();
    if (!siteName) errors.push("Site name cannot be empty");
    value.site_name = siteName;
  }

  if (body.call_number !== undefined) {
    value.call_number = String(body.call_number).trim().slice(0, 30);
  }

  if (body.whatsapp_number !== undefined) {
    value.whatsapp_number = String(body.whatsapp_number).trim().slice(0, 30);
  }

  if (body.about_text !== undefined) {
    value.about_text = String(body.about_text);
  }

  return { errors, value };
}

function validateSocialLinkPayload(body) {
  const errors = [];
  const platform = typeof body.platform === "string" ? body.platform.trim().toLowerCase() : "";
  const url = typeof body.url === "string" ? body.url.trim() : "";

  if (!platform) errors.push("Platform is required");
  if (!url) errors.push("URL is required");
  if (url && !/^https?:\/\//i.test(url)) {
    errors.push("URL must start with http:// or https://");
  }

  return { errors, value: { platform, url } };
}

module.exports = { validateSettingsPayload, validateSocialLinkPayload };
