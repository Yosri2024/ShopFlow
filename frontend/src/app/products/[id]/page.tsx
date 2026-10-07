"use client";
import { useEffect, useState } from "react";
import api, { Product } from "@/lib/api";
import { RatingStars } from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/Skeleton";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export default function FicheProduit() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [msg, setMsg] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/api/products/${id}`).then(r=>setP(r.data)).catch(()=>setMsg("Produit introuvable"));
    api.get(`/api/reviews/product/${id}`).then(r=>setReviews(r.data)).catch(()=>{});
  }, [id]);

  const addToCart = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("accessToken")) {
      setMsg("Connecte-toi d'abord");
      setTimeout(()=> window.location.href="/login", 1200);
      return;
    }
    try {
      await api.post("/api/cart/items", { productId: Number(id), variantId: selectedVariant, quantite: qty });
      setMsg("Ajoute au panier");
    } catch(e:any){
      const m = e.response?.data?.error || "";
      if (m.toLowerCase().includes("unauthorized") || e.response?.status===401) {
        setMsg("Connecte-toi d'abord");
        setTimeout(()=> window.location.href="/login", 1200);
      } else setMsg(m || "Erreur");
    }
  };

  if (!p) return <div className="p-10 text-center">{msg || "Chargement..."}</div>;

  return (
    <FadeIn>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <div className="aspect-square bg-zinc-100 rounded-2xl overflow-hidden flex items-center justify-center">
              {p.images?.[activeImg] ? <img src={p.images[activeImg]} alt={p.nom} className="w-full h-full object-cover" /> : <span className="text-zinc-400">No image</span>}
            </div>
            {p.images && p.images.length>1 && (
              <div className="flex gap-2 mt-3">
                {p.images.map((img,i)=> (
                  <button key={i} onClick={()=>setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${activeImg===i ? "border-black" : "border-zinc-200"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold">{p.nom}</h1>
            <p className="text-zinc-500 mt-2 text-sm leading-relaxed">{p.description}</p>
            <div className="mt-4 flex items-baseline gap-2">
              {p.prixPromo ? <><span className="text-2xl font-bold text-emerald-600">{p.prixPromo} €</span> <span className="line-through text-zinc-400">{p.prix} €</span></> : <span className="text-2xl font-bold">{p.prix} €</span>}
            </div>
            <div className="text-sm mt-2 flex items-center gap-2"><span className={p.stock>0?"text-emerald-600":"text-red-600"}>{p.stock>0 ? `En stock (${p.stock})` : "Rupture"}</span> <span>|</span> <RatingStars note={p.noteMoyenne} /></div>

            {p.variants?.length>0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Variantes</div>
                <select value={selectedVariant ?? ""} onChange={e=>setSelectedVariant(e.target.value? Number(e.target.value): null)} className="w-full border-2 rounded-xl px-3 py-2 text-sm bg-white" style={{ borderColor: "#0D9488" }}>
                  <option value="">Choisir variante</option>
                  {p.variants.map(v=> <option key={v.id} value={v.id}>{v.attribut}: {v.valeur} {v.prixDelta ? `(+${v.prixDelta} €)` : ""}</option>)}
                </select>
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border-2 rounded-full" style={{ borderColor: "#0D9488" }}>
                <button onClick={()=>setQty(Math.max(1, qty-1))} className="w-9 h-9 flex items-center justify-center hover:bg-zinc-50 rounded-l-full"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button onClick={()=>setQty(qty+1)} className="w-9 h-9 flex items-center justify-center hover:bg-zinc-50 rounded-r-full"><Plus className="w-4 h-4" /></button>
              </div>
              <motion.button whileTap={{ scale:0.97 }} onClick={addToCart} className="flex-1 py-2.5 rounded-full font-medium flex items-center justify-center gap-2" style={{ background: "#0D9488", color: "#FFFFFF" }}>
                <ShoppingCart className="w-4 h-4" /> Ajouter au panier
              </motion.button>
            </div>
            {msg && <div className="mt-3 text-sm text-center border rounded-xl p-2 bg-zinc-50">{msg}</div>}

            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-2">Avis clients</h3>
              {reviews.length===0 ? <p className="text-sm text-zinc-500">Aucun avis. Achete puis laisse un avis 1 a 5.</p> :
                reviews.map((r:any)=> <div key={r.id} className="border-2 rounded-xl p-3 mb-2 bg-white" style={{ borderColor: "#0D9488" }}><div className="text-sm font-medium">{"★".repeat(r.note)} {r.note}/5</div><p className="text-sm text-zinc-600">{r.commentaire}</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
