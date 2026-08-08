import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getPublicBlogs, getPublicStudies } from "@/lib/serverApi";

const routes = ["", "/books", "/studies", "/blog", "/contact"];

async function getAllBlogEntries() {
  const firstPage = await getPublicBlogs(1);
  const pages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) => getPublicBlogs(index + 2))
  );
  return [firstPage, ...pages].flatMap((result) => result.items);
}

async function getAllStudyEntries() {
  const firstPage = await getPublicStudies({ page: 1 });
  const pages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) => getPublicStudies({ page: index + 2 }))
  );
  return [firstPage, ...pages].flatMap((result) => result.items);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, studies] = await Promise.all([getAllBlogEntries(), getAllStudyEntries()]);

  const staticEntries = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `/${locale}${route}`,
      lastModified: new Date(),
    }))
  );

  const blogEntries = locales.flatMap((locale) =>
    blogs.map((blog) => ({
      url: `/${locale}/blog/${blog.slug}`,
      lastModified: blog.published_at ? new Date(blog.published_at) : new Date(),
    }))
  );

  const studyEntries = locales.flatMap((locale) =>
    studies.map((study) => ({
      url: `/${locale}/studies/${study.slug}`,
      lastModified: study.published_at ? new Date(study.published_at) : new Date(),
    }))
  );

  return [...staticEntries, ...blogEntries, ...studyEntries];
}
