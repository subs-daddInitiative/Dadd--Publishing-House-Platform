const {
  getSettings,
  updateSettings,
  updateLogo,
  getSocialLinks,
  upsertSocialLink,
  removeSocialLink,
} = require("./settings.repository");
const { validateSettingsPayload, validateSocialLinkPayload } = require("./settings.validation");

async function getPublicSettings(req, res, next) {
  try {
    const settings = await getSettings();
    const socialLinks = await getSocialLinks();
    res.json({
      success: true,
      data: {
        siteName: settings.site_name,
        logo: settings.logo,
        callNumber: settings.call_number,
        whatsappNumber: settings.whatsapp_number,
        aboutText: settings.about_text,
        socialLinks: socialLinks.filter((link) => link.is_active),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminSettings(req, res, next) {
  try {
    const settings = await getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function updateGeneralSettings(req, res, next) {
  try {
    const { errors, value } = validateSettingsPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    const settings = await updateSettings(value);
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function uploadLogo(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }
    const logoPath = `/uploads/logos/${req.file.filename}`;
    const settings = await updateLogo(logoPath);
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function listSocialLinks(req, res, next) {
  try {
    const links = await getSocialLinks();
    res.json({ success: true, data: links });
  } catch (error) {
    next(error);
  }
}

async function saveSocialLink(req, res, next) {
  try {
    const { errors, value } = validateSocialLinkPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    const links = await upsertSocialLink(value.platform, value.url);
    res.json({ success: true, data: links });
  } catch (error) {
    next(error);
  }
}

async function deleteSocialLink(req, res, next) {
  try {
    const links = await removeSocialLink(req.params.platform);
    res.json({ success: true, data: links });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateGeneralSettings,
  uploadLogo,
  listSocialLinks,
  saveSocialLink,
  deleteSocialLink,
};
