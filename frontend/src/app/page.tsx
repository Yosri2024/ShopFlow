"use client";
import { useEffect, useState } from "react";
import api, { Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<{id:number,nom:string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/products?page=0&size=8").then(r => setProducts(r.data.content || r.data)),
      api.get("/api/categories").then(r => setCats(r.data)).catch(()=>{})
    ]).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div>
      {/* Bannière pro neutre */}
      <div className="bg-zinc-900 text-white py-14 px-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">ShopFlow</h1>
        <p className="text-zinc-400">Marketplace B2C • 9 produits • Livraison rapide</p>
        <a href="/products" className="inline-block mt-5 bg-white text-zinc-900 px-7 py-2.5 rounded-full font-bold hover:bg-zinc-100">Voir catalogue →</a>
      </div>

      {/* Catégories neutre */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-2 flex-wrap">
        {cats.map(c => (
          <a key={c.id} href={`/products?categorie=${c.id}`}
             className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-zinc-200 shadow-sm hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition">
            {c.nom}
          </a>
        ))}
        {cats.length===0 && <span className="text-zinc-400 text-sm">Aucune catégorie</span>}
      </div>

      {/* Produits vedette */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <h2 className="text-xl font-semibold mb-4">Produits en vedette</h2>
        {products.length===0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-zinc-500">Aucun produit — connecte-toi en SELLER et ajoute via POST /api/products</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
