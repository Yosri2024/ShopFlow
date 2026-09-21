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
      {/* Bannière promo */}
      <div className="bg-gradient-to-r from-black to-zinc-800 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">ShopFlow</h1>
        <p className="text-zinc-300">Marketplace B2C - Produits en vedette</p>
        <a href="/products" className="inline-block mt-4 bg-white text-black px-6 py-2 rounded-full font-medium">Voir catalogue</a>
      </div>

      {/* Catégories */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-2 flex-wrap">
        {cats.map(c => (
          <a key={c.id} href={`/products?categorie=${c.id}`} className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-black hover:text-white">{c.nom}</a>
        ))}
        {cats.length===0 && <span className="text-zinc-400 text-sm">Aucune catégorie — crée-en via API</span>}
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
