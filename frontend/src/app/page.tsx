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
  const [tri, setTri] = useState("");

  const fetchProducts = (cat = categorie, isPromo = promo) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (prixMin) params.set("prixMin", prixMin);
    if (prixMax) params.set("prixMax", prixMax);
    if (cat) params.set("categorie", cat);
    if (isPromo) params.set("promo", "true");
    if (tri) params.set("sort", tri);
    params.set("page", "0"); params.set("size", "8");
    setLoading(true);
    api.get(`/api/products?${params}`).then(r => setProducts(r.data.content || r.data)).finally(()=>setLoading(false));
  };

  const [role, setRole] = useState<string | null>(null);
  useEffect(() => { setRole(localStorage.getItem("role")); }, []);
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
        {role === "SELLER" && (
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <a href="/seller?tab=produits" className="px-5 py-2 rounded-full text-sm font-bold border bg-white" style={{ borderColor: "#FFFFFF", color: "#0F172A" }}>+ Ajouter produit</a>
            <a href="/seller?tab=commandes" className="px-5 py-2 rounded-full text-sm font-medium border" style={{ borderColor: "#334155", color: "#CBD5E1", background: "transparent" }}>Voir commandes</a>
            <a href="/seller?tab=dashboard" className="px-5 py-2 rounded-full text-sm font-medium border" style={{ borderColor: "#334155", color: "#CBD5E1", background: "transparent" }}>Dashboard</a>
          </div>
        )}
        {role === "ADMIN" && (
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <a href="/seller" className="px-5 py-2 rounded-full text-sm font-bold" style={{ background: "#F59E0B", color: "#1F2937" }}>Dashboard Admin</a>
            <a href="/products" className="px-5 py-2 rounded-full text-sm font-bold border bg-white" style={{ borderColor: "#FFFFFF", color: "#0F172A" }}>Gérer catalogue</a>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 bg-white border-2 rounded-2xl p-4 space-y-3 shadow-sm" style={{ borderColor: "#0D9488", boxShadow: "0 4px 16px rgba(13,148,136,0.12)" }}>
        <div className="flex gap-2 flex-wrap">
        <button onClick={()=>{
          const nc = categorie==="1" ? "" : "1";
          setCategorie(nc);
          fetchProducts(nc, promo);
        }} className="px-4 py-2 rounded-full border text-sm font-medium transition hover:shadow-sm" style={categorie==="1" ? { background: "#0D9488", color: "#FFFFFF", borderColor: "#0D9488", boxShadow: "0 2px 8px rgba(13,148,136,0.3)" } : { background: "#FFFFFF", borderColor: "#0D9488", color: "#0D9488" }}>Électronique</button>
        <button onClick={()=>{
          const nc = categorie==="2" ? "" : "2";
          setCategorie(nc);
          fetchProducts(nc, promo);
        }} className="px-4 py-2 rounded-full border text-sm font-medium transition hover:shadow-sm" style={categorie==="2" ? { background: "#059669", color: "#FFFFFF", borderColor: "#059669", boxShadow: "0 2px 8px rgba(5,150,105,0.3)" } : { background: "#FFFFFF", borderColor: "#059669", color: "#059669" }}>Mode</button>
        <button onClick={()=>{
          const np = !promo;
          setPromo(np);
          fetchProducts(categorie, np);
        }} className="px-4 py-2 rounded-full border text-sm font-medium transition hover:shadow-sm" style={promo ? { background: "#F59E0B", color: "#1F2937", borderColor: "#F59E0B", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" } : { background: "#FFFFFF", borderColor: "#F59E0B", color: "#B45309" }}>En promo</button>
          {(categorie || promo) && <button onClick={()=>{setCategorie(""); setPromo(false); fetchProducts("", false);}} className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "#FECACA", color: "#DC2626", background: "#FFFFFF" }}>Effacer filtre(s)</button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <input placeholder="Recherche..." value={q} onChange={e=>setQ(e.target.value)} className="border-2 px-4 py-2 rounded-full text-sm flex-1 min-w-[160px] outline-none" style={{ borderColor: "#0D9488", background: "#FFFFFF" }} />
          <input placeholder="Prix min" type="number" value={prixMin} onChange={e=>setPrixMin(e.target.value)} className="border-2 px-4 py-2 rounded-full text-sm w-32 outline-none" style={{ borderColor: "#0D9488", background: "#FFFFFF" }} />
          <input placeholder="Prix max" type="number" value={prixMax} onChange={e=>setPrixMax(e.target.value)} className="border-2 px-4 py-2 rounded-full text-sm w-32 outline-none" style={{ borderColor: "#0D9488", background: "#FFFFFF" }} />
          <select value={tri} onChange={e=>setTri(e.target.value)} className="border-2 px-3 py-2 rounded-full text-sm outline-none" style={{ borderColor: "#0D9488", background: "#FFFFFF", color: "#0F172A" }}>
            <option value="">Trier par</option>
            <option value="nom,asc">A - Z</option>
            <option value="nom,desc">Z - A</option>
            <option value="prix,asc">Prix croissant</option>
            <option value="prix,desc">Prix decroissant</option>
          </select>
          <button onClick={()=>fetchProducts()} className="px-6 py-2 rounded-full text-sm font-medium" style={{ background: "#0D9488", color: "#FFFFFF" }}>Filtrer</button>
          <button onClick={()=>{setQ(""); setPrixMin(""); setPrixMax(""); setCategorie(""); setPromo(false); setTri(""); fetchProducts("", false);}} className="px-4 py-2 rounded-full border-2 text-sm font-semibold hover:shadow-sm transition" style={{ borderColor: "#0F172A", background: "#FFFFFF", color: "#0F172A" }}>Reset</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-10 mt-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#0F172A" }}>Produits en vedette</h2>
        {products.length===0 ? (
          <div className="bg-white border-2 rounded-2xl p-10 text-center" style={{ borderColor: "#0D9488", color: "#64748B" }}>Aucun produit</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
            {products.map((p)=> <div key={p.id} className="h-full"><ProductCard p={p} /></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
