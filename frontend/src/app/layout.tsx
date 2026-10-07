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
        <footer className="bg-[#0F172A] text-zinc-300 mt-10">
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="font-bold text-white mb-3 tracking-wide">ShopFlow</div>
              <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>Marketplace B2C — Électronique & Mode. Livraison rapide, paiement sécurisé et retours simplifiés.</p>
              <div className="mt-4 flex gap-2">
                <a href="/products" className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#0D9488", color: "white" }}>Explorer</a>
                <a href="/register" className="px-3 py-1.5 rounded-full text-xs font-medium border" style={{ borderColor: "#334155", color: "#CBD5E1" }}>Créer un compte</a>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Acheter</div>
              <div className="space-y-2 text-xs" style={{ color: "#94A3B8" }}>
                <a href="/products" className="block hover:text-white transition">Catalogue</a>
                <a href="/cart" className="block hover:text-white transition">Panier</a>
                <a href="/orders" className="block hover:text-white transition">Mes commandes</a>
                <a href="/privacy" className="block hover:text-white transition">Confidentialité</a>
                <a href="/terms" className="block hover:text-white transition">Conditions d'utilisation</a>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Vendre</div>
              <div className="space-y-2 text-xs" style={{ color: "#94A3B8" }}>
                
                <a href="/register" className="block hover:text-white transition">Devenir vendeur</a>
                <a href="/cgu" className="block hover:text-white transition">Frais & CGU vendeur</a>
                <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">API Docs</a>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Aide</div>
              <div className="space-y-2 text-xs" style={{ color: "#94A3B8" }}>
                <a href="/orders" className="block hover:text-white transition">Suivi commande</a>
                <a href="/cart" className="block hover:text-white transition">Retours & échanges</a>
                <a href="mailto:support@shopflow.com" className="block hover:text-white transition">support@shopflow.com</a>
                <span className="block" style={{ color: "#64748B" }}>Lun-Ven 9h-18h — Tunis</span>
              </div>
            </div>
          </div>
          <div className="border-t" style={{ borderColor: "#1E293B" }}>
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs" style={{ color: "#64748B" }}>
              <span>ShopFlow © 2026 — B2C Marketplace</span>
              <span className="flex items-center gap-3"><span className="px-2 py-1 rounded-full text-[10px] border" style={{ borderColor: "#334155", color: "#94A3B8" }}>Livraison 48h</span><span className="px-2 py-1 rounded-full text-[10px] border" style={{ borderColor: "#334155", color: "#94A3B8" }}>Paiement sécurisé</span></span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
