"use client";
import { useEffect, useState } from "react";
import api, { Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<{id:number,nom:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState("");
  const [promo, setPromo] = useState(false);
  const [q, setQ] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");

  const fetchProducts = (cat = categorie, isPromo = promo) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (prixMin) params.set("prixMin", prixMin);
    if (prixMax) params.set("prixMax", prixMax);
    if (cat) params.set("categorie", cat);
    if (isPromo) params.set("promo", "true");
    params.set("page", "0"); params.set("size", "8");
    setLoading(true);
    api.get(`/api/products?${params}`).then(r => setProducts(r.data.content || r.data)).finally(()=>setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      api.get("/api/products?page=0&size=8").then(r => setProducts(r.data.content || r.data)),
      api.get("/api/categories").then(r => setCats(r.data)).catch(()=>{})
    ]).finally(()=>setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="h-32 rounded-2xl mb-6 animate-pulse" style={{ background: "#F1F5F9" }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({length:8}).map((_,i)=> <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-white py-14 px-6 text-center" style={{ background: "#0F172A" }}>
        <h1 className="text-4xl font-bold tracking-tight mb-2">ShopFlow</h1>
        <p className="text-zinc-300">Marketplace B2C avec 9 produits et livraison rapide</p>
        <a href="/products" className="inline-block mt-5 px-7 py-2.5 rounded-full font-bold" style={{ background: "#FFFFFF", color: "#0F172A" }}>Voir catalogue</a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 bg-white border rounded-2xl flex gap-2 flex-wrap items-center" style={{ borderColor: "#E5E7EB" }}>
        <button onClick={()=>{
          const nc = categorie==="1" ? "" : "1";
          setCategorie(nc); setPromo(false);
          fetchProducts(nc, false);
        }} className="px-4 py-2 rounded-full border text-sm" style={categorie==="1" ? { background: "#0F172A", color: "#FFFFFF", borderColor: "#0F172A" } : { background: "#FFFFFF", borderColor: "#E5E7EB", color: "#334155" }}>Electronics</button>
        <button onClick={()=>{
          const nc = categorie==="2" ? "" : "2";
          setCategorie(nc); setPromo(false);
          fetchProducts(nc, false);
        }} className="px-4 py-2 rounded-full border text-sm" style={categorie==="2" ? { background: "#0F172A", color: "#FFFFFF", borderColor: "#0F172A" } : { background: "#FFFFFF", borderColor: "#E5E7EB", color: "#334155" }}>Mode</button>
        <button onClick={()=>{
          const np = !promo;
          setPromo(np); setCategorie("");
          fetchProducts("", np);
        }} className="px-4 py-2 rounded-full border text-sm" style={promo ? { background: "#0F172A", color: "#FFFFFF", borderColor: "#0F172A" } : { background: "#FFFFFF", borderColor: "#E5E7EB", color: "#334155" }}>En promo</button>
        <input placeholder="Recherche..." value={q} onChange={e=>setQ(e.target.value)} className="border px-4 py-2 rounded-full text-sm flex-1 min-w-[140px] outline-none" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }} />
        <input placeholder="Prix min" type="number" value={prixMin} onChange={e=>setPrixMin(e.target.value)} className="border px-4 py-2 rounded-full text-sm w-24 outline-none" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }} />
        <input placeholder="Prix max" type="number" value={prixMax} onChange={e=>setPrixMax(e.target.value)} className="border px-4 py-2 rounded-full text-sm w-24 outline-none" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }} />
        <button onClick={()=>fetchProducts()} className="px-6 py-2 rounded-full text-sm font-medium" style={{ background: "#0F172A", color: "#FFFFFF" }}>Filtrer</button>
        <button onClick={()=>{setQ(""); setPrixMin(""); setPrixMax(""); setCategorie(""); setPromo(false); fetchProducts("", false);}} className="px-4 py-2 rounded-full border text-sm" style={{ borderColor: "#E5E7EB", background: "#FFFFFF", color: "#334155" }}>Reset</button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-10 mt-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#0F172A" }}>Produits en vedette</h2>
        {products.length===0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center" style={{ borderColor: "#E5E7EB", color: "#64748B" }}>Aucun produit</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
            {products.map((p)=> <div key={p.id} className="h-full"><ProductCard p={p} /></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
