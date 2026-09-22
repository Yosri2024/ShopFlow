"use client";
import { useEffect, useState } from "react";
import api, { Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default function Catalogue() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [categorie, setCategorie] = useState("");
  const [promo, setPromo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (prixMin) params.set("prixMin", prixMin);
    if (prixMax) params.set("prixMax", prixMax);
    if (categorie) params.set("categorie", categorie);
    if (promo) params.set("promo", "true");
    params.set("page", "0"); params.set("size", "20");
    api.get(`/api/products?${params}`).then(r => setProducts(r.data.content || r.data))
      .catch(e => setError(e.message)).finally(()=>setLoading(false));
  };
  useEffect(()=>{ fetch(); }, []);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #F0FDFA 0%, #ECFEFF 100%)" }}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#0F172A", fontFamily: "var(--font-poppins)" }}>Catalogue</h1>
        <div className="bg-white border shadow-sm rounded-2xl p-4 mb-6 space-y-3" style={{ borderColor: "#CCFBF1", boxShadow: "0 4px 12px rgba(13,148,136,0.08)" }}>
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=>{
              const nc = categorie==="1" ? "" : "1";
              setCategorie(nc); setPromo(false);
              const params = new URLSearchParams(); if(q) params.set("q",q); if(prixMin) params.set("prixMin",prixMin); if(prixMax) params.set("prixMax",prixMax); if(nc) params.set("categorie",nc); params.set("page","0"); params.set("size","20");
              setLoading(true); api.get(`/api/products?${params}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
            }} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${categorie==="1" ? "text-white" : "bg-white"}`} style={categorie==="1" ? { background: "#0D9488", color: "#FFFFFF", borderColor: "#0D9488" } : { borderColor: "#CCFBF1", color: "#0F172A" }}>Electronics</button>
            <button onClick={()=>{
              const nc = categorie==="2" ? "" : "2";
              setCategorie(nc); setPromo(false);
              const params = new URLSearchParams(); if(q) params.set("q",q); if(prixMin) params.set("prixMin",prixMin); if(prixMax) params.set("prixMax",prixMax); if(nc) params.set("categorie",nc); params.set("page","0"); params.set("size","20");
              setLoading(true); api.get(`/api/products?${params}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
            }} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${categorie==="2" ? "text-white" : "bg-white"}`} style={categorie==="2" ? { background: "#059669", color: "#FFFFFF", borderColor: "#059669" } : { borderColor: "#CCFBF1", color: "#0F172A" }}>Mode</button>
            <button onClick={()=>{
              const np = !promo;
              setPromo(np); setCategorie("");
              const params = new URLSearchParams(); if(q) params.set("q",q); if(prixMin) params.set("prixMin",prixMin); if(prixMax) params.set("prixMax",prixMax); if(np) params.set("promo","true"); params.set("page","0"); params.set("size","20");
              setLoading(true); api.get(`/api/products?${params}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
            }} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition flex items-center gap-1 ${promo ? "text-white" : ""}`} style={promo ? { background: "#F59E0B", color: "#1F2937", borderColor: "#F59E0B" } : { background: "#FFFFFF", borderColor: "#CCFBF1", color: "#0F172A" }}>{promo ? "✓ " : ""}En promo {promo ? "(remise)" : ""}</button>
            {(categorie || promo) && <button onClick={()=>{setCategorie(""); setPromo(false); const p=new URLSearchParams(); if(q) p.set("q",q); p.set("page","0"); p.set("size","20"); setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));}} className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "#FECACA", color: "#DC2626" }}>Effacer filtres</button>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <input placeholder="Recherche..." value={q} onChange={e=>setQ(e.target.value)} className="border px-3 py-2 rounded-full text-sm focus:ring-2 outline-none flex-1 min-w-[140px]" style={{ borderColor: "#CCFBF1", background: "#F0FDFA" }} />
            <input placeholder="Prix min" type="number" value={prixMin} onChange={e=>setPrixMin(e.target.value)} className="border px-3 py-2 rounded-full text-sm w-24" style={{ borderColor: "#CCFBF1", background: "#F0FDFA" }} />
            <input placeholder="Prix max" type="number" value={prixMax} onChange={e=>setPrixMax(e.target.value)} className="border px-3 py-2 rounded-full text-sm w-24" style={{ borderColor: "#CCFBF1", background: "#F0FDFA" }} />
            <button onClick={fetch} className="px-5 py-2 rounded-full text-sm font-medium transition" style={{ background: "#0D9488", color: "#FFFFFF", boxShadow: "0 2px 8px rgba(13,148,136,0.25)" }}>Filtrer</button>
            <a href="/products" onClick={(e)=>{e.preventDefault(); setQ(""); setPrixMin(""); setPrixMax(""); setCategorie(""); setPromo(false); fetch();}} className="px-4 py-2 border rounded-full text-sm" style={{ borderColor: "#CCFBF1", background: "#FFFFFF", color: "#0F172A" }}>Reset</a>
          </div>
        </div>
        {loading ? <div className="text-center py-10" style={{ color: "#64748B" }}>Chargement...</div> : error ? <div className="border rounded-xl p-4" style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>{error} - Verifie que backend :8080 tourne</div> :
         products.length===0 ? <div className="bg-white border rounded-xl p-10 text-center shadow" style={{ borderColor: "#CCFBF1", color: "#64748B" }}>Aucun produit - verifie data.sql (9 produits) ou backend</div> :
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
           {products.map(p => <div key={p.id} className="h-full"><ProductCard p={p} /></div>)}
         </div>
        }
      </div>
    </div>
  );
}
