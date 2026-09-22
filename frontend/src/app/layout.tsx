import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  title: "ShopFlow - Boutique en ligne",
  description: "Mini projet ShopFlow Spring Boot + Next.js - yosri",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-teal-100 bg-white py-6 text-center text-sm" style={{ borderColor: "#CCFBF1" }}>
          <div className="font-medium" style={{ color: "#0F172A" }}>ShopFlow © 2026 - yosri</div>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            <a href="/terms" className="hover:underline" style={{ color: "#0D9488" }}>CGV</a>
            <a href="/privacy" className="hover:underline" style={{ color: "#0D9488" }}>Confidentialité</a>
            <a href="/cgu" className="hover:underline" style={{ color: "#0D9488" }}>CGU</a>
            <a href="http://localhost:8080/swagger-ui.html" className="hover:underline" style={{ color: "#0891B2" }}>API Docs</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
