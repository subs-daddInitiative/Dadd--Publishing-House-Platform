const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { optionalSubscriberAuth } = require("../../middlewares/optionalSubscriberAuth");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const { createImageUpload } = require("../../middlewares/imageUpload");
const { blockAssetUpload } = require("./blockAssetUpload");
const { compressImages } = require("../../middlewares/compressImage");
const { enforceMediaLimits } = require("../../middlewares/enforceMediaLimits");
const { createCategoryRepository } = require("../../utils/categoryRepository");
const { createCategoryController } = require("../../utils/categoryController");
const {
  getPublicBlogs,
  getPublicBlogBySlug,
  getAdminBlogs,
  getHighlightedBlogsCountHandler,
  getAdminBlogById,
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler,
  uploadBlockAssetHandler,
  submitWriterBlogHandler,
  listWriterBlogsHandler,
  getWriterBlogByIdHandler,
  updateWriterBlogHandler,
  getPendingReviewBlogsHandler,
  reviewBlogHandler,
  getBlogTranslationsHandler,
  getBlogTranslationHandler,
  upsertBlogTranslationHandler,
  deleteBlogTranslationHandler,
} = require("./blogs.controller");

const blogUpload = createImageUpload("blogs");
const blogCategories = createCategoryController(createCategoryRepository("blogs_categories"));

const publicRouter = Router();
publicRouter.get("/blogs", getPublicBlogs);
publicRouter.get("/blogs-categories", blogCategories.listPublic);
publicRouter.get("/blogs/:slug", optionalSubscriberAuth, getPublicBlogBySlug);

publicRouter.post("/subscriber/blogs", requireSubscriberAuth, blogUpload.single("cover_image"), enforceMediaLimits, compressImages, submitWriterBlogHandler);
publicRouter.get("/subscriber/blogs", requireSubscriberAuth, listWriterBlogsHandler);
publicRouter.post("/subscriber/blogs/upload-asset", requireSubscriberAuth, blockAssetUpload.single("file"), enforceMediaLimits, compressImages, uploadBlockAssetHandler);
publicRouter.get("/subscriber/blogs/:id", requireSubscriberAuth, getWriterBlogByIdHandler);
publicRouter.put("/subscriber/blogs/:id", requireSubscriberAuth, blogUpload.single("cover_image"), enforceMediaLimits, compressImages, updateWriterBlogHandler);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/blogs", getAdminBlogs);
adminRouter.get("/blogs/pending-review", getPendingReviewBlogsHandler);
adminRouter.get("/blogs/highlighted-count", getHighlightedBlogsCountHandler);
adminRouter.post("/blogs/:id/review", reviewBlogHandler);
adminRouter.get("/blogs/:id", getAdminBlogById);
adminRouter.get("/blogs/:id/translations", getBlogTranslationsHandler);
adminRouter.get("/blogs/:id/translations/:locale", getBlogTranslationHandler);
adminRouter.put("/blogs/:id/translations/:locale", upsertBlogTranslationHandler);
adminRouter.delete("/blogs/:id/translations/:locale", deleteBlogTranslationHandler);
adminRouter.post("/blogs", blogUpload.single("cover_image"), enforceMediaLimits, compressImages, createBlogHandler);
adminRouter.put("/blogs/:id", blogUpload.single("cover_image"), enforceMediaLimits, compressImages, updateBlogHandler);
adminRouter.delete("/blogs/:id", deleteBlogHandler);
adminRouter.post("/blogs/upload-asset", blockAssetUpload.single("file"), enforceMediaLimits, compressImages, uploadBlockAssetHandler);

adminRouter.get("/blogs-categories", blogCategories.list);
adminRouter.post("/blogs-categories", blogCategories.create);
adminRouter.put("/blogs-categories/:id", blogCategories.update);
adminRouter.delete("/blogs-categories/:id", blogCategories.remove);
adminRouter.get("/blogs-categories/:id/translations", blogCategories.getTranslations);
adminRouter.put("/blogs-categories/:id/translations/:locale", blogCategories.upsertTranslationHandler);
adminRouter.delete("/blogs-categories/:id/translations/:locale", blogCategories.deleteTranslationHandler);

module.exports = { publicRouter, adminRouter };
