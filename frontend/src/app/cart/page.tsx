"use client";
import { useEffect, useState } from "react";
import api, { Cart } from "@/lib/api";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/Skeleton";
import { Minus, Plus, Trash2, Tag } from "lucide-react";

export default function Panier() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => api.get("/api/cart").then(r=>setCart(r.data)).catch(e=>setMsg(e.response?.data?.error||"Connecte-toi pour voir ton panier"));
  useEffect(()=>{ load(); }, []);

  const updateQty = async (id:number, quantite:number) => {
    if (quantite < 1) return;
    await api.put(`/api/cart/items/${id}`, { quantite });
    load();
  };
  const remove = async (id:number) => { await api.delete(`/api/cart/items/${id}`); load(); };
  const applyCoupon = async () => {
    try { const {data}=await api.post("/api/cart/coupon",{code}); setCart(data); setMsg("Coupon appliqué"); } catch(e:any){ setMsg(e.response?.data?.error||"Coupon invalide"); }
  };

  if (!cart) return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="animate-pulse space-y-3">
        <div className="h-6 bg-zinc-100 rounded w-32" />
        <div className="h-20 bg-zinc-100 rounded-xl" />
        <div className="h-32 bg-zinc-100 rounded-xl" />
      </div>
      {msg && <div className="mt-4 text-center text-sm border rounded-xl p-3 bg-amber-50">{msg}</div>}
    </div>
  );

  return (
    <FadeIn>
      <div className="max-w-3xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold mb-4">Panier {cart.lignes.length===0 && "(vide)"}</h1>
        {cart.lignes.length===0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center text-zinc-500">Ton panier est vide. <a href="/products" className="underline">Voir catalogue</a></div>
        ) : (
          <div className="space-y-3">
            {cart.lignes.map(l=> (
              <motion.div key={l.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex-1">
                  <div className="font-medium">{l.productNom}</div>
                  <div className="text-sm text-zinc-500">{l.prixUnitaire} €</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>updateQty(l.id, l.quantite-1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-zinc-50"><Minus className="w-4 h-4" /></button>
                  <span className="w-8 text-center font-medium">{l.quantite}</span>
                  <button onClick={()=>updateQty(l.id, l.quantite+1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-zinc-50"><Plus className="w-4 h-4" /></button>
                  <button onClick={()=>remove(l.id)} className="ml-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Sticky total */}
        <div className="mt-6 sticky bottom-4 bg-white border rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex justify-between text-sm"><span>Sous-total</span><span>{cart.sousTotal} €</span></div>
          <div className="flex justify-between text-sm"><span>Livraison</span><span>{cart.fraisLivraison} €</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total TTC</span><span>{cart.totalTTC} €</span></div>
          {cart.couponCode && <div className="text-emerald-600 text-sm flex items-center gap-1"><Tag className="w-4 h-4" /> Coupon {cart.couponCode} appliqué</div>}
        </div>

        <div className="flex gap-2 mt-4">
          <div className="flex-1 flex gap-2 bg-white border rounded-full p-1" style={{ borderColor: "#CCFBF1" }}>
            <input placeholder="Code promo" value={code} onChange={e=>setCode(e.target.value)} className="flex-1 px-3 py-1 text-sm outline-none bg-transparent" />
            <button onClick={applyCoupon} className="px-4 py-1.5 rounded-full text-sm font-medium transition" style={{ background: "#0D9488", color: "#FFFFFF" }}>Appliquer</button>
          </div>
          <button onClick={async()=>{await api.delete("/api/cart/coupon"); load();}} className="border px-4 rounded-full text-sm hover:bg-zinc-50" style={{ borderColor: "#CCFBF1" }}>Retirer</button>
        </div>

        {cart.lignes.length>0 && (
          <motion.a whileTap={{ scale:0.98 }} href="/checkout" className="block mt-6 text-center py-3 rounded-full font-medium transition" style={{ background: "#0D9488", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(13,148,136,0.25)" }}>Commander</motion.a>
        )}
        {msg && <div className="mt-3 text-sm text-center border rounded-xl p-3 bg-zinc-50">{msg}</div>}
      </div>
    </FadeIn>
  );
}
