"use client";
import { useEffect, useState } from "react";

export function Navbar() {
  const [auth, setAuth] = useState(false);
  useEffect(() => setAuth(!!localStorage.getItem("accessToken")), []);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: "#CCFBF1", boxShadow: "0 2px 12px rgba(13,148,136,0.08)" }}>
      <a href="/" className="font-bold text-xl" style={{ color: "#0F172A", fontFamily: "var(--font-poppins)" }}>ShopFlow</a>
      <div className="flex gap-2 text-sm items-center">
        {!auth ? (
          <>
            <a href="/login" className="button type1 type1-secondary button-nav"><span className="btn-txt">Login</span></a>
            <a href="/register" className="button type1 type1-accent button-nav"><span className="btn-txt">Register</span></a>
          </>
        ) : (
          <>
            <a href="/products" className="button type1 type1-primary button-nav"><span className="btn-txt">Catalogue</span></a>
            <a href="/cart" className="button type1 type1-primary button-nav"><span className="btn-txt">Panier</span></a>
            <a href="/orders" className="px-3 py-2 rounded-xl font-medium transition" style={{ background: "#059669", color: "#FFFFFF" }}>Mes commandes</a>
            <button onClick={() => { localStorage.clear(); location.href = "/login"; }} className="px-3 py-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-[#DC2626]" style={{ background: "#DC2626", color: "#FFFFFF", boxShadow: "0 2px 8px rgba(220,38,38,0.25)" }} onMouseEnter={e=> (e.currentTarget.style.background="#B91C1C")} onMouseLeave={e=> (e.currentTarget.style.background="#DC2626")}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
