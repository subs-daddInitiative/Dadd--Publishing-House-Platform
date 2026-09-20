const {
  listActiveBanners,
  listAllBanners,
  createBanner,
  findBannerById,
  updateBanner,
  softDeleteBanner,
} = require("./banners.repository");
const { validateBannerPayload } = require("./banners.validation");

async function getPublicBanners(req, res, next) {
  try {
    const placement = req.query.placement === "subscription_offers" ? "subscription_offers" : "hero";
    const banners = await listActiveBanners(placement);
    res.json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
}

async function getAllBanners(req, res, next) {
  try {
    const banners = await listAllBanners();
    res.json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
}

async function createBannerHandler(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Banner image is required" });
    }
    const { errors, value } = validateBannerPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const image = `/uploads/banners/${req.file.filename}`;
    const id = await createBanner({ ...value, image });
    const banner = await findBannerById(id);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
}

async function updateBannerHandler(req, res, next) {
  try {
    const banner = await findBannerById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    const { errors, value } = validateBannerPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (req.file) {
      value.image = `/uploads/banners/${req.file.filename}`;
    }

    const updated = await updateBanner(req.params.id, value);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteBannerHandler(req, res, next) {
  try {
    const banner = await findBannerById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    await softDeleteBanner(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicBanners,
  getAllBanners,
  createBannerHandler,
  updateBannerHandler,
  deleteBannerHandler,
};
