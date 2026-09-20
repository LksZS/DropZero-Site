import type { Metadata } from "next";
import { Barlow_Condensed, Permanent_Marker, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { CartSheet } from "@/components/cart-sheet";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store-provider";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const marker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: { default: "DROPZERO — Streetwear independente", template: "%s — DROPZERO" },
  description: "Streetwear independente nascido na rua. Drops limitados, roupa sem permissão.",
  keywords: ["streetwear", "roupa urbana", "skate", "DropZero", "street culture"],
  openGraph: {
    title: "DROPZERO — Não peça permissão",
    description: "Drops limitados. Feito fora da linha.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${mono.variable} ${marker.variable}`}>
      <body>
        <StoreProvider>
          <SiteHeader />
          {children}
          <CartSheet />
        </StoreProvider>
      </body>
    </html>
  );
}
