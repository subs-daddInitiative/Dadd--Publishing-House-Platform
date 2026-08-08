const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { booksUpload } = require("./booksUpload");
const { createCategoryRepository } = require("../../utils/categoryRepository");
const { createCategoryController } = require("../../utils/categoryController");
const {
  getPublicBooks,
  getPublicBookBySlug,
  getAdminBooks,
  getAdminBookById,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
} = require("./books.controller");

const uploadFields = booksUpload.fields([
  { name: "cover_image", maxCount: 1 },
  { name: "pdf_file", maxCount: 1 },
]);
const bookCategories = createCategoryController(createCategoryRepository("books_categories"));

const publicRouter = Router();
publicRouter.get("/books", getPublicBooks);
publicRouter.get("/books-categories", bookCategories.list);
publicRouter.get("/books/:slug", getPublicBookBySlug);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/books", getAdminBooks);
adminRouter.get("/books/:id", getAdminBookById);
adminRouter.post("/books", uploadFields, createBookHandler);
adminRouter.put("/books/:id", uploadFields, updateBookHandler);
adminRouter.delete("/books/:id", deleteBookHandler);

adminRouter.get("/books-categories", bookCategories.list);
adminRouter.post("/books-categories", bookCategories.create);
adminRouter.put("/books-categories/:id", bookCategories.update);
adminRouter.delete("/books-categories/:id", bookCategories.remove);

module.exports = { publicRouter, adminRouter };
