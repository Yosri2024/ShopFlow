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
      {/* Bannière pro */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white py-14 px-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">ShopFlow — La boutique pro</h1>
        <p className="text-indigo-100">Marketplace B2C • Livraison 24h • PROMO -20% avec PROMO10</p>
        <a href="/products" className="inline-block mt-5 bg-white text-indigo-700 px-7 py-2.5 rounded-full font-bold shadow hover:bg-zinc-50">Voir catalogue →</a>
      </div>

      {/* Catégories pro */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-2 flex-wrap">
        {cats.map(c => {
          const isElec = c.nom.toLowerCase().includes("electro");
          return (
            <a key={c.id} href={`/products?categorie=${c.id}`}
               className={`px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm transition ${isElec ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700" : "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"}`}>
              {c.nom}
            </a>
          );
        })}
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
