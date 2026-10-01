// Public origin of the site (no trailing slash). Set SITE_URL in the
// environment for production, e.g. https://example.org
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
