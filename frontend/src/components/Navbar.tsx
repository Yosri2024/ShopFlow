"use client";
import { useEffect, useState } from "react";

export function Navbar() {
  const [auth, setAuth] = useState(false);
  useEffect(() => setAuth(!!localStorage.getItem("accessToken")), []);
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b px-6 py-3 flex items-center justify-between">
      <a href="/" className="font-bold text-xl">ShopFlow</a>
      <div className="flex gap-2 text-sm items-center">
        <a href="/products" className="px-3 py-1.5 rounded-full border bg-white hover:bg-zinc-50 transition">Catalogue</a>
        <a href="/cart" className="px-4 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium">Panier</a>
        <a href="/login" className="px-4 py-1.5 rounded-full bg-zinc-900 text-white hover:bg-black transition font-medium">Login</a>
        <a href="/register" className="px-4 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium">Register</a>
        {auth && (
          <>
            <a href="/orders" className="px-3 py-1.5 rounded-full border bg-white hover:bg-zinc-50 transition">Mes commandes</a>
            <button onClick={() => { localStorage.clear(); location.href = "/login"; }} className="px-3 py-1.5 rounded-full border hover:bg-red-50 hover:text-red-600 transition">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
