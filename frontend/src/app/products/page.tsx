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
    <div className="min-h-screen" style={{ background: "#F0FDFA" }}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>Catalogue</h1>
        <div className="bg-white border rounded-2xl p-4 mb-6 flex gap-2 flex-wrap items-center" style={{ borderColor: "#E5E7EB" }}>
          <button onClick={()=>{
            const nc = categorie==="1" ? "" : "1";
            setCategorie(nc); setPromo(false);
            const p = new URLSearchParams(); if(q) p.set("q",q); if(prixMin) p.set("prixMin",prixMin); if(prixMax) p.set("prixMax",prixMax); if(nc) p.set("categorie",nc); p.set("page","0"); p.set("size","20");
            setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
          }} className="px-4 py-2 rounded-full border text-sm" style={categorie==="1" ? { background: "#0F172A", color: "#FFFFFF", borderColor: "#0F172A" } : { background: "#FFFFFF", borderColor: "#E5E7EB", color: "#334155" }}>Electronics</button>
          <button onClick={()=>{
            const nc = categorie==="2" ? "" : "2";
            setCategorie(nc); setPromo(false);
            const p = new URLSearchParams(); if(q) p.set("q",q); if(prixMin) p.set("prixMin",prixMin); if(prixMax) p.set("prixMax",prixMax); if(nc) p.set("categorie",nc); p.set("page","0"); p.set("size","20");
            setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
          }} className="px-4 py-2 rounded-full border text-sm" style={categorie==="2" ? { background: "#0F172A", color: "#FFFFFF", borderColor: "#0F172A" } : { background: "#FFFFFF", borderColor: "#E5E7EB", color: "#334155" }}>Mode</button>
          <button onClick={()=>{
            const np = !promo;
            setPromo(np); setCategorie("");
            const p = new URLSearchParams(); if(q) p.set("q",q); if(prixMin) p.set("prixMin",prixMin); if(prixMax) p.set("prixMax",prixMax); if(np) p.set("promo","true"); p.set("page","0"); p.set("size","20");
            setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
          }} className="px-4 py-2 rounded-full border text-sm" style={promo ? { background: "#0F172A", color: "#FFFFFF", borderColor: "#0F172A" } : { background: "#FFFFFF", borderColor: "#E5E7EB", color: "#334155" }}>En promo</button>
          <input placeholder="Recherche..." value={q} onChange={e=>setQ(e.target.value)} className="border px-4 py-2 rounded-full text-sm flex-1 min-w-[140px] outline-none" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }} />
          <input placeholder="Prix min" type="number" value={prixMin} onChange={e=>setPrixMin(e.target.value)} className="border px-4 py-2 rounded-full text-sm w-24 outline-none" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }} />
          <input placeholder="Prix max" type="number" value={prixMax} onChange={e=>setPrixMax(e.target.value)} className="border px-4 py-2 rounded-full text-sm w-24 outline-none" style={{ borderColor: "#E5E7EB", background: "#FFFFFF" }} />
          <button onClick={fetch} className="px-6 py-2 rounded-full text-sm font-medium" style={{ background: "#0F172A", color: "#FFFFFF" }}>Filtrer</button>
          <button onClick={()=>{setQ(""); setPrixMin(""); setPrixMax(""); setCategorie(""); setPromo(false); const p=new URLSearchParams(); p.set("page","0"); p.set("size","20"); setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));}} className="px-4 py-2 rounded-full border text-sm" style={{ borderColor: "#E5E7EB", background: "#FFFFFF", color: "#334155" }}>Reset</button>
        </div>
        {loading ? <div className="text-center py-10" style={{ color: "#64748B" }}>Chargement...</div> : error ? <div className="border rounded-xl p-4" style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>{error} - Verifie que backend :8080 tourne</div> :
         products.length===0 ? <div className="bg-white border rounded-xl p-10 text-center" style={{ borderColor: "#E5E7EB", color: "#64748B" }}>Aucun produit</div> :
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
           {products.map(p => <div key={p.id} className="h-full"><ProductCard p={p} /></div>)}
         </div>
        }
      </div>
    </div>
  );
}
