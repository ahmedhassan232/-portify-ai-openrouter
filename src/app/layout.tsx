import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "@/styles/globals.css";
import { I18nProvider } from "@/i18n/provider";
import { ProjectProvider } from "@/hooks/use-project";
import { ToastProvider } from "@/components/ui/overlay";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex-ar", display: "swap" });

export const metadata: Metadata = {
  title: "Portify AI: Your CV. Your Story. Your Portfolio.",
  description: "Turn your CV into a professional portfolio website with AI. No account required.",
};
export const viewport: Viewport = { themeColor: "#16a0d2", width: "device-width", initialScale: 1 };

// Applies the saved language to <html> before first paint so direction never flashes.
const LANG_SCRIPT = `try{var l=localStorage.getItem('portify:lang');if(l==='ar'||l==='en'){var d=document.documentElement;d.lang=l;d.dir=l==='ar'?'rtl':'ltr'}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${inter.variable} ${cairo.variable} ${plex.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
        <noscript><style>{`html:not([data-lang-ready]) body{opacity:1!important}`}</style></noscript>
      </head>
      <body>
        <I18nProvider><ProjectProvider><ToastProvider>{children}</ToastProvider></ProjectProvider></I18nProvider>
      </body>
    </html>
  );
}
