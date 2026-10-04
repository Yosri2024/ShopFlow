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
  const [tri, setTri] = useState("");
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
    if (tri) params.set("sort", tri);
    params.set("page", "0"); params.set("size", "20");
    api.get(`/api/products?${params}`).then(r => setProducts(r.data.content || r.data))
      .catch(e => setError(e.message)).finally(()=>setLoading(false));
  };
  useEffect(()=>{ fetch(); }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F0FDFA" }}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>Catalogue</h1>
        <div className="bg-white border rounded-2xl p-4 space-y-3 shadow-sm mb-6" style={{ borderColor: "#CCFBF1", boxShadow: "0 4px 16px rgba(13,148,136,0.08)" }}>
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=>{
              const nc = categorie==="1" ? "" : "1";
              setCategorie(nc);
              const p = new URLSearchParams(); if(q) p.set("q",q); if(prixMin) p.set("prixMin",prixMin); if(prixMax) p.set("prixMax",prixMax); if(nc) p.set("categorie",nc); if(promo) p.set("promo","true"); p.set("page","0"); p.set("size","20");
              setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
            }} className="px-4 py-2 rounded-full border text-sm font-medium transition hover:shadow-sm" style={categorie==="1" ? { background: "#0D9488", color: "#FFFFFF", borderColor: "#0D9488", boxShadow: "0 2px 8px rgba(13,148,136,0.3)" } : { background: "#FFFFFF", borderColor: "#0D9488", color: "#0D9488" }}>Électronique</button>
            <button onClick={()=>{
              const nc = categorie==="2" ? "" : "2";
              setCategorie(nc);
              const p = new URLSearchParams(); if(q) p.set("q",q); if(prixMin) p.set("prixMin",prixMin); if(prixMax) p.set("prixMax",prixMax); if(nc) p.set("categorie",nc); if(promo) p.set("promo","true"); p.set("page","0"); p.set("size","20");
              setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
            }} className="px-4 py-2 rounded-full border text-sm font-medium transition hover:shadow-sm" style={categorie==="2" ? { background: "#059669", color: "#FFFFFF", borderColor: "#059669", boxShadow: "0 2px 8px rgba(5,150,105,0.3)" } : { background: "#FFFFFF", borderColor: "#059669", color: "#059669" }}>Mode</button>
            <button onClick={()=>{
              const np = !promo;
              setPromo(np);
              const p = new URLSearchParams(); if(q) p.set("q",q); if(prixMin) p.set("prixMin",prixMin); if(prixMax) p.set("prixMax",prixMax); if(np) p.set("promo","true"); if(categorie) p.set("categorie",categorie); p.set("page","0"); p.set("size","20");
              setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));
            }} className="px-4 py-2 rounded-full border text-sm font-medium transition hover:shadow-sm" style={promo ? { background: "#F59E0B", color: "#1F2937", borderColor: "#F59E0B", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" } : { background: "#FFFFFF", borderColor: "#F59E0B", color: "#B45309" }}>En promo</button>
            {(categorie || promo) && <button onClick={()=>{setCategorie(""); setPromo(false); const p=new URLSearchParams(); if(q) p.set("q",q); if(prixMin) p.set("prixMin",prixMin); if(prixMax) p.set("prixMax",prixMax); p.set("page","0"); p.set("size","20"); setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));}} className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "#FECACA", color: "#DC2626", background: "#FFFFFF" }}>Effacer filtre(s)</button>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <input placeholder="Recherche..." value={q} onChange={e=>setQ(e.target.value)} className="border px-4 py-2 rounded-full text-sm flex-1 min-w-[160px] outline-none" style={{ borderColor: "#CCFBF1", background: "#FFFFFF" }} />
            <input placeholder="Prix min" type="number" value={prixMin} onChange={e=>setPrixMin(e.target.value)} className="border px-4 py-2 rounded-full text-sm w-32 outline-none" style={{ borderColor: "#CCFBF1", background: "#FFFFFF" }} />
            <input placeholder="Prix max" type="number" value={prixMax} onChange={e=>setPrixMax(e.target.value)} className="border px-4 py-2 rounded-full text-sm w-32 outline-none" style={{ borderColor: "#CCFBF1", background: "#FFFFFF" }} />
            <select value={tri} onChange={e=>setTri(e.target.value)} className="border px-3 py-2 rounded-full text-sm outline-none" style={{ borderColor: "#CCFBF1", background: "#FFFFFF", color: "#0F172A" }}>
              <option value="">Trier par</option>
              <option value="nom,asc">A - Z</option>
              <option value="nom,desc">Z - A</option>
              <option value="prix,asc">Prix croissant</option>
              <option value="prix,desc">Prix decroissant</option>
            </select>
            <button onClick={fetch} className="px-6 py-2 rounded-full text-sm font-medium" style={{ background: "#0D9488", color: "#FFFFFF" }}>Filtrer</button>
            <button onClick={()=>{setQ(""); setPrixMin(""); setPrixMax(""); setCategorie(""); setPromo(false); setTri(""); const p=new URLSearchParams(); p.set("page","0"); p.set("size","20"); setLoading(true); api.get(`/api/products?${p}`).then(r=>setProducts(r.data.content||r.data)).finally(()=>setLoading(false));}} className="px-4 py-2 rounded-full border-2 text-sm font-semibold hover:shadow-sm transition" style={{ borderColor: "#0F172A", background: "#FFFFFF", color: "#0F172A" }}>Reset</button>
          </div>
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
