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
        <footer className="border-t bg-white py-8 text-sm" style={{ borderColor: "#CCFBF1" }}>
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
            <div>
              <div className="font-bold mb-2" style={{ color: "#0F172A" }}>Get to Know Us</div>
              <div className="space-y-1 text-xs" style={{ color: "#64748B" }}>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Careers</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Blog</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">About Amazon</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Investor Relations</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Amazon Devices</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Amazon Science</a>
              </div>
            </div>
            <div>
              <div className="font-bold mb-2" style={{ color: "#0F172A" }}>Let Us Help You</div>
              <div className="space-y-1 text-xs" style={{ color: "#64748B" }}>
                <a href="/orders" className="block hover:underline hover:text-[#0D9488]">Your Account</a>
                <a href="/orders" className="block hover:underline hover:text-[#0D9488]">Your Orders</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Shipping Rates & Policies</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Returns & Replacements</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Manage Your Content and Devices</a>
                <a href="#" className="block hover:underline hover:text-[#0D9488]">Help</a>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 pt-4 border-t text-xs" style={{ borderColor: "#F0FDFA", color: "#94A3B8" }}>ShopFlow © 2026 - yosri</div>
        </footer>
      </body>
    </html>
  );
}
