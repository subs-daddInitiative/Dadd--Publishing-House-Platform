import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  ar: () => import("./dictionaries/ar.json").then((mod) => mod.default),
  en: () => import("./dictionaries/en.json").then((mod) => mod.default),
  de: () => import("./dictionaries/de.json").then((mod) => mod.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ar"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
