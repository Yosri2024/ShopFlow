"use client";
import { useEffect, useState } from "react";

export function Navbar() {
  const [auth, setAuth] = useState(false);
  useEffect(() => setAuth(!!localStorage.getItem("accessToken")), []);
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b px-6 py-3 flex items-center justify-between">
      <a href="/" className="font-bold text-xl">ShopFlow</a>
      <div className="flex gap-4 text-sm">
        <a href="/products" className="hover:underline">Catalogue</a>
        <a href="/cart" className="hover:underline">Panier</a>
        {auth ? (
          <>
            <a href="/orders" className="hover:underline">Mes commandes</a>
            <button onClick={() => { localStorage.clear(); location.href = "/login"; }} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <a href="/login" className="hover:underline">Login</a>
            <a href="/register" className="bg-black text-white px-3 py-1 rounded-full">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}
