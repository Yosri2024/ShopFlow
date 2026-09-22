"use client";
import { useEffect, useState } from "react";
import api, { Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<{id:number,nom:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState("");
  const [promo, setPromo] = useState(false);

  const fetchProducts = (cat = categorie, isPromo = promo) => {
    const params = new URLSearchParams();
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
        <div className="h-32 rounded-2xl mb-6 animate-pulse" style={{ background: "#CCFBF1" }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({length:8}).map((_,i)=> <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: "#F0FDFA", border: "1px solid #CCFBF1" }} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-white py-14 px-6 text-center" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}>
        <motion.h1 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "var(--font-poppins)" }}>ShopFlow</motion.h1>
        <p className="text-white/90">Marketplace B2C avec 9 produits et livraison rapide</p>
        <motion.a whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} href="/products" className="inline-block mt-5 px-7 py-2.5 rounded-full font-bold shadow" style={{ background: "#FFFFFF", color: "#0F172A", boxShadow: "0 4px 12px rgba(15,23,42,0.15)" }}>Voir catalogue</motion.a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-2 flex-wrap items-center">
        <button onClick={()=>{
          const nc = categorie==="1" ? "" : "1";
          setCategorie(nc); setPromo(false);
          fetchProducts(nc, false);
        }} className="px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm transition" style={categorie==="1" ? { background: "#0D9488", color: "#FFFFFF", borderColor: "#0D9488", boxShadow: "0 2px 8px rgba(13,148,136,0.3)" } : { background: "#FFFFFF", color: "#0F172A", borderColor: "#CCFBF1" }}>Electronics</button>
        <button onClick={()=>{
          const nc = categorie==="2" ? "" : "2";
          setCategorie(nc); setPromo(false);
          fetchProducts(nc, false);
        }} className="px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm transition" style={categorie==="2" ? { background: "#059669", color: "#FFFFFF", borderColor: "#059669", boxShadow: "0 2px 8px rgba(5,150,105,0.3)" } : { background: "#FFFFFF", color: "#0F172A", borderColor: "#CCFBF1" }}>Mode</button>
        <button onClick={()=>{
          const np = !promo;
          setPromo(np); setCategorie("");
          fetchProducts("", np);
        }} className="px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm transition flex items-center gap-1" style={promo ? { background: "#F59E0B", color: "#1F2937", borderColor: "#F59E0B", boxShadow: "0 2px 8px rgba(245,158,11,0.3)" } : { background: "#FFFFFF", color: "#0F172A", borderColor: "#CCFBF1" }}>{promo ? "✓ " : ""}En promo</button>
        {cats.length===0 && <span className="text-sm" style={{ color: "#64748B" }}>Aucune catégorie</span>}
        {(categorie || promo) && <button onClick={()=>{setCategorie(""); setPromo(false); fetchProducts("", false);}} className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "#FECACA", color: "#DC2626", background: "#FFFFFF" }}>Effacer</button>}
        <a href="/products" className="ml-auto text-sm underline" style={{ color: "#0D9488" }}>Voir tout →</a>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-10">
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#0F172A", fontFamily: "var(--font-poppins)" }}>Produits en vedette</h2>
        {products.length===0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center shadow-sm" style={{ borderColor: "#CCFBF1", color: "#64748B" }}>Aucun produit</div>
        ) : (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
            {products.map((p,i)=> <motion.div key={p.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }} className="h-full"><ProductCard p={p} /></motion.div>)}
          </motion.div>
        )}
      </div>
    </div>
  );
}
