import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopFlow - Boutique en ligne",
  description: "Mini projet ShopFlow Spring Boot + Next.js - Ghada Feki",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-4 text-center text-sm text-zinc-500">ShopFlow © 2026 - Ghada Feki</footer>
      </body>
    </html>
  );
}
