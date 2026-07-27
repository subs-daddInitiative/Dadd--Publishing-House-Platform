import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const routes = ["", "/books", "/studies", "/blog", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `/${locale}${route}`,
      lastModified: new Date(),
    }))
  );
}
