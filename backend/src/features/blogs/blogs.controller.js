const {
  listCategories,
  listPublicBlogs,
  countPublicBlogs,
  findPublicBlogBySlug,
  findRelatedBlogs,
  listAdminBlogs,
  findAdminBlogById,
  ensureUniqueSlug,
  createBlog,
  updateBlog,
  softDeleteBlog,
} = require("./blogs.repository");
const { validateBlogPayload } = require("./blogs.validation");
const { getSettings } = require("../settings/settings.repository");

const PAGE_SIZE = 9;

async function defaultAuthorName() {
  const settings = await getSettings();
  return settings?.site_name || null;
}

async function getPublicBlogs(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const offset = (page - 1) * PAGE_SIZE;

    const [items, total] = await Promise.all([
      listPublicBlogs({ limit: PAGE_SIZE, offset }),
      countPublicBlogs(),
    ]);

    res.json({
      success: true,
      data: { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) },
    });
  } catch (error) {
    next(error);
  }
}

async function getPublicBlogBySlug(req, res, next) {
  try {
    const blog = await findPublicBlogBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    const related = await findRelatedBlogs(blog.category_id, blog.id);
    res.json({ success: true, data: { ...blog, related } });
  } catch (error) {
    next(error);
  }
}

async function getBlogCategories(req, res, next) {
  try {
    const categories = await listCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

async function getAdminBlogs(req, res, next) {
  try {
    const blogs = await listAdminBlogs();
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
}

async function getAdminBlogById(req, res, next) {
  try {
    const blog = await findAdminBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

async function createBlogHandler(req, res, next) {
  try {
    const { errors, value } = validateBlogPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const slug = await ensureUniqueSlug(value.slug || value.title);
    const coverImage = req.file ? `/uploads/blogs/${req.file.filename}` : null;

    const id = await createBlog({
      ...value,
      slug,
      cover_image: coverImage,
      author_id: req.user.sub,
      author_name: value.author_name || (await defaultAuthorName()),
    });
    const blog = await findAdminBlogById(id);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

async function updateBlogHandler(req, res, next) {
  try {
    const existing = await findAdminBlogById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const { errors, value } = validateBlogPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (value.slug !== undefined) {
      value.slug = await ensureUniqueSlug(value.slug, existing.id);
    }

    if (value.author_name !== undefined && value.author_name === "") {
      value.author_name = await defaultAuthorName();
    }

    if (req.file) {
      value.cover_image = `/uploads/blogs/${req.file.filename}`;
    }

    const updated = await updateBlog(req.params.id, value);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteBlogHandler(req, res, next) {
  try {
    const existing = await findAdminBlogById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    await softDeleteBlog(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicBlogs,
  getPublicBlogBySlug,
  getBlogCategories,
  getAdminBlogs,
  getAdminBlogById,
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler,
};
