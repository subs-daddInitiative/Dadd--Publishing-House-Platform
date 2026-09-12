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
  getBlogCategories,
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
} = require("./blogs.controller");

const blogUpload = createImageUpload("blogs");
const blogCategories = createCategoryController(createCategoryRepository("blogs_categories"));

const publicRouter = Router();
publicRouter.get("/blogs", getPublicBlogs);
publicRouter.get("/blogs-categories", getBlogCategories);
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
adminRouter.post("/blogs", blogUpload.single("cover_image"), enforceMediaLimits, compressImages, createBlogHandler);
adminRouter.put("/blogs/:id", blogUpload.single("cover_image"), enforceMediaLimits, compressImages, updateBlogHandler);
adminRouter.delete("/blogs/:id", deleteBlogHandler);
adminRouter.post("/blogs/upload-asset", blockAssetUpload.single("file"), enforceMediaLimits, compressImages, uploadBlockAssetHandler);

adminRouter.get("/blogs-categories", blogCategories.list);
adminRouter.post("/blogs-categories", blogCategories.create);
adminRouter.put("/blogs-categories/:id", blogCategories.update);
adminRouter.delete("/blogs-categories/:id", blogCategories.remove);

module.exports = { publicRouter, adminRouter };
