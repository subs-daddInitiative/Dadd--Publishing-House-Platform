"use client";

import { useEffect } from "react";

type SyncHtmlAttributesProps = {
  lang: string;
  dir: "rtl" | "ltr";
};

export function SyncHtmlAttributes({ lang, dir }: SyncHtmlAttributesProps) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return null;
}
