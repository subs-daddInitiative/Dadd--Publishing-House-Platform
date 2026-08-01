const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { createImageUpload } = require("../../middlewares/imageUpload");
const {
  getPublicBlogs,
  getPublicBlogBySlug,
  getBlogCategories,
  getAdminBlogs,
  getAdminBlogById,
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler,
} = require("./blogs.controller");

const blogUpload = createImageUpload("blogs");

const publicRouter = Router();
publicRouter.get("/blogs", getPublicBlogs);
publicRouter.get("/blogs-categories", getBlogCategories);
publicRouter.get("/blogs/:slug", getPublicBlogBySlug);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/blogs", getAdminBlogs);
adminRouter.get("/blogs/:id", getAdminBlogById);
adminRouter.post("/blogs", blogUpload.single("cover_image"), createBlogHandler);
adminRouter.put("/blogs/:id", blogUpload.single("cover_image"), updateBlogHandler);
adminRouter.delete("/blogs/:id", deleteBlogHandler);

module.exports = { publicRouter, adminRouter };
