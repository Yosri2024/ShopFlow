"use client";
import { useEffect, useState } from "react";

export function Navbar() {
  const [auth, setAuth] = useState(false);
  useEffect(() => setAuth(!!localStorage.getItem("accessToken")), []);
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b px-6 py-3 flex items-center justify-between">
      <a href="/" className="font-bold text-xl">ShopFlow</a>
      <div className="flex gap-2 text-sm items-center">
        <a href="/products" className="px-4 py-1.5 rounded-full bg-white border border-zinc-200 hover:bg-zinc-100 transition font-medium">Catalogue</a>
        <a href="/cart" className="px-4 py-1.5 rounded-full bg-black text-white hover:bg-zinc-800 transition font-medium shadow">Panier</a>
        <a href="/login" className="px-4 py-1.5 rounded-full bg-white border border-zinc-300 hover:bg-zinc-50 transition font-medium">Login</a>
        <a href="/register" className="px-4 py-1.5 rounded-full bg-black text-white hover:bg-zinc-800 transition font-medium shadow">Register</a>
        {auth && (
          <>
            <a href="/orders" className="px-3 py-1.5 rounded-full bg-zinc-100 border hover:bg-zinc-200 transition">Mes commandes</a>
            <button onClick={() => { localStorage.clear(); location.href = "/login"; }} className="px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
