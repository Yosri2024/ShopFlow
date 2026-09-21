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
    <div className="max-w-6xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Catalogue</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input placeholder="Recherche..." value={q} onChange={e=>setQ(e.target.value)} className="border px-3 py-2 rounded-full text-sm" />
        <input placeholder="Prix min" type="number" value={prixMin} onChange={e=>setPrixMin(e.target.value)} className="border px-3 py-2 rounded-full text-sm w-28" />
        <input placeholder="Prix max" type="number" value={prixMax} onChange={e=>setPrixMax(e.target.value)} className="border px-3 py-2 rounded-full text-sm w-28" />
        <button onClick={fetch} className="bg-black text-white px-4 py-2 rounded-full text-sm">Filtrer</button>
        <a href="/products" className="px-4 py-2 border rounded-full text-sm">Reset</a>
      </div>
      {loading ? <div>Chargement...</div> : error ? <div className="text-red-500">{error}</div> :
       products.length===0 ? <div className="bg-white border rounded-xl p-10 text-center text-zinc-500">Aucun produit</div> :
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {products.map(p => <ProductCard key={p.id} p={p} />)}
       </div>
      }
    </div>
  );
}
