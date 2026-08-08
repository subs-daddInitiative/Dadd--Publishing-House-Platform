const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { createImageUpload } = require("../../middlewares/imageUpload");
const { createCategoryRepository } = require("../../utils/categoryRepository");
const { createCategoryController } = require("../../utils/categoryController");
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
const blogCategories = createCategoryController(createCategoryRepository("blogs_categories"));

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

adminRouter.get("/blogs-categories", blogCategories.list);
adminRouter.post("/blogs-categories", blogCategories.create);
adminRouter.put("/blogs-categories/:id", blogCategories.update);
adminRouter.delete("/blogs-categories/:id", blogCategories.remove);

module.exports = { publicRouter, adminRouter };
