"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const [auth, setAuth] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setAuth(!!localStorage.getItem("accessToken"));
    const d = localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const toggle = () => {
    const nd = !dark;
    setDark(nd);
    document.documentElement.classList.toggle("dark", nd);
    localStorage.setItem("theme", nd ? "dark" : "light");
  };
  return (
    <nav className="sticky top-0 z-50 bg-white border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: "#CCFBF1", boxShadow: "0 2px 12px rgba(13,148,136,0.08)" }}>
      <a href="/" className="font-bold text-xl" style={{ color: "#0F172A", fontFamily: "var(--font-poppins)" }}>ShopFlow</a>
      <div className="flex gap-2 text-sm items-center">
        <a href="/products" className="button type1 type1-primary button-nav"><span className="btn-txt">Catalogue</span></a>
        <a href="/cart" className="button type1 type1-primary button-nav"><span className="btn-txt">Panier</span></a>
        <a href="/login" className="button type1 type1-secondary button-nav"><span className="btn-txt">Login</span></a>
        <a href="/register" className="button type1 type1-accent button-nav"><span className="btn-txt">Register</span></a>
        <button onClick={toggle} aria-label="Mode nuit" className="w-9 h-9 rounded-full border flex items-center justify-center transition ml-1" style={{ borderColor: "#CCFBF1", background: dark ? "#0F172A" : "#FFFFFF", color: dark ? "#F59E0B" : "#0D9488" }}>
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        {auth && (
          <>
            <a href="/orders" className="px-3 py-2 rounded-xl font-medium transition" style={{ background: "#059669", color: "#FFFFFF" }}>Mes commandes</a>
            <button onClick={() => { localStorage.clear(); location.href = "/login"; }} className="px-3 py-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-[#DC2626]" style={{ background: "#DC2626", color: "#FFFFFF", boxShadow: "0 2px 8px rgba(220,38,38,0.25)" }} onMouseEnter={e=> (e.currentTarget.style.background="#B91C1C")} onMouseLeave={e=> (e.currentTarget.style.background="#DC2626")}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
