import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Poppins } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexSansArabic.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
