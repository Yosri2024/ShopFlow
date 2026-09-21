"use client";
import { useEffect, useState } from "react";
import api, { Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default function Catalogue() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (prixMin) params.set("prixMin", prixMin);
    if (prixMax) params.set("prixMax", prixMax);
    params.set("page", "0"); params.set("size", "20");
    api.get(`/api/products?${params}`).then(r => setProducts(r.data.content || r.data))
      .catch(e => setError(e.message)).finally(()=>setLoading(false));
  };
  useEffect(()=>{ fetch(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-white">Catalogue</h1>
        <div className="bg-white dark:bg-zinc-900 border shadow-sm rounded-2xl p-4 mb-6 flex gap-2 flex-wrap">
          <input placeholder="Recherche..." value={q} onChange={e=>setQ(e.target.value)} className="border border-zinc-200 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input placeholder="Prix min" type="number" value={prixMin} onChange={e=>setPrixMin(e.target.value)} className="border border-zinc-200 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-full text-sm w-28" />
          <input placeholder="Prix max" type="number" value={prixMax} onChange={e=>setPrixMax(e.target.value)} className="border border-zinc-200 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-full text-sm w-28" />
          <button onClick={fetch} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm hover:bg-indigo-700 shadow">Filtrer</button>
          <a href="/products" className="px-4 py-2 border border-zinc-200 bg-white dark:bg-zinc-800 rounded-full text-sm hover:bg-zinc-50">Reset</a>
        </div>
        {loading ? <div className="text-center py-10 text-zinc-500">Chargement...</div> : error ? <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">{error} — Vérifie que backend :8080 tourne</div> :
         products.length===0 ? <div className="bg-white dark:bg-zinc-900 border rounded-xl p-10 text-center text-zinc-500 shadow">Aucun produit — vérifie data.sql (9 produits) ou backend</div> :
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {products.map(p => <ProductCard key={p.id} p={p} />)}
         </div>
        }
      </div>
    </div>
  );
}
