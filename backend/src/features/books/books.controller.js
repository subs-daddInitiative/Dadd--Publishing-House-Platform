const {
  listPublicBooks,
  countPublicBooks,
  findPublicBookBySlug,
  findRelatedBooks,
  listAdminBooks,
  findAdminBookById,
  ensureUniqueSlug,
  createBook,
  updateBook,
  softDeleteBook,
  replaceExternalLinks,
  TRANSLATABLE_LOCALES,
  listTranslations,
  findTranslation,
  upsertTranslation,
  deleteTranslation,
} = require("./books.repository");
const { validateBookPayload, validateBookTranslationPayload } = require("./books.validation");

const PAGE_SIZE = 12;
const SORTS = ["newest", "oldest", "price_asc", "price_desc"];

function coverPath(file) {
  return `/uploads/books/${file.filename}`;
}

function pdfPath(file) {
  return `/uploads/books-pdfs/${file.filename}`;
}

async function getPublicBooks(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const offset = (page - 1) * PAGE_SIZE;
    const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
    const sort = SORTS.includes(req.query.sort) ? req.query.sort : "newest";
    const locale = typeof req.query.locale === "string" ? req.query.locale : undefined;

    const [items, total] = await Promise.all([
      listPublicBooks({ limit: PAGE_SIZE, offset, categorySlug, sort, locale }),
      countPublicBooks({ categorySlug }),
    ]);

    res.json({
      success: true,
      data: { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) },
    });
  } catch (error) {
    next(error);
  }
}

async function getPublicBookBySlug(req, res, next) {
  try {
    const locale = typeof req.query.locale === "string" ? req.query.locale : undefined;
    const book = await findPublicBookBySlug(req.params.slug, locale);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    const related = await findRelatedBooks(book.category_id, book.id, locale);
    res.json({ success: true, data: { ...book, related } });
  } catch (error) {
    next(error);
  }
}

async function getAdminBooks(req, res, next) {
  try {
    const books = await listAdminBooks();
    res.json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
}

async function getAdminBookById(req, res, next) {
  try {
    const book = await findAdminBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

async function createBookHandler(req, res, next) {
  try {
    const { errors, value, externalLinks } = validateBookPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const slug = await ensureUniqueSlug(value.slug || value.title);
    const coverFile = req.files?.cover_image?.[0];
    const pdfFile = req.files?.pdf_file?.[0];

    const id = await createBook({
      ...value,
      slug,
      cover_image: coverFile ? coverPath(coverFile) : null,
      pdf_file: pdfFile ? pdfPath(pdfFile) : null,
    });

    if (externalLinks) {
      await replaceExternalLinks(id, externalLinks);
    }

    const book = await findAdminBookById(id);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

async function updateBookHandler(req, res, next) {
  try {
    const existing = await findAdminBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const { errors, value, externalLinks } = validateBookPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (value.slug !== undefined) {
      value.slug = await ensureUniqueSlug(value.slug, existing.id);
    }

    const coverFile = req.files?.cover_image?.[0];
    const pdfFile = req.files?.pdf_file?.[0];
    if (coverFile) value.cover_image = coverPath(coverFile);
    if (pdfFile) value.pdf_file = pdfPath(pdfFile);

    const updated = await updateBook(req.params.id, value);

    if (externalLinks) {
      await replaceExternalLinks(existing.id, externalLinks);
    }

    res.json({ success: true, data: await findAdminBookById(req.params.id) });
  } catch (error) {
    next(error);
  }
}

async function deleteBookHandler(req, res, next) {
  try {
    const existing = await findAdminBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    await softDeleteBook(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

function requireValidLocale(req, res) {
  if (!TRANSLATABLE_LOCALES.includes(req.params.locale)) {
    res.status(400).json({ success: false, message: "Unsupported locale" });
    return false;
  }
  return true;
}

async function getBookTranslationsHandler(req, res, next) {
  try {
    const existing = await findAdminBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    const translations = await listTranslations(req.params.id);
    res.json({ success: true, data: translations });
  } catch (error) {
    next(error);
  }
}

async function upsertBookTranslationHandler(req, res, next) {
  try {
    if (!requireValidLocale(req, res)) return;
    const existing = await findAdminBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    const { value } = validateBookTranslationPayload(req.body);
    const translation = await upsertTranslation(existing.id, req.params.locale, value);
    res.json({ success: true, data: translation });
  } catch (error) {
    next(error);
  }
}

async function deleteBookTranslationHandler(req, res, next) {
  try {
    if (!requireValidLocale(req, res)) return;
    const existing = await findAdminBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    await deleteTranslation(req.params.id, req.params.locale);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicBooks,
  getPublicBookBySlug,
  getAdminBooks,
  getAdminBookById,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
  getBookTranslationsHandler,
  upsertBookTranslationHandler,
  deleteBookTranslationHandler,
};
