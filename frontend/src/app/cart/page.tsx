"use client";
import { useEffect, useState } from "react";
import api, { Cart } from "@/lib/api";

export default function Panier() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => api.get("/api/cart").then(r=>setCart(r.data)).catch(e=>setMsg(e.response?.data?.error||"Connecte-toi"));
  useEffect(()=>{ load(); }, []);

  const updateQty = async (id:number, quantite:number) => {
    await api.put(`/api/cart/items/${id}`, { quantite });
    load();
  };
  const remove = async (id:number) => { await api.delete(`/api/cart/items/${id}`); load(); };
  const applyCoupon = async () => {
    try { const {data}=await api.post("/api/cart/coupon",{code}); setCart(data); setMsg("Coupon appliqué"); } catch(e:any){ setMsg(e.response?.data?.error||"Coupon invalide"); }
  };

  if (!cart) return <div className="p-10 text-center">{msg || "Chargement panier..."}</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Panier {cart.lignes.length===0 && "(vide)"}</h1>
      {cart.lignes.map(l=> (
        <div key={l.id} className="flex items-center justify-between border-b py-3">
          <div>{l.productNom} x {l.quantite} — {l.prixUnitaire} €</div>
          <div className="flex gap-2">
            <input type="number" min={1} value={l.quantite} onChange={e=>updateQty(l.id, Number(e.target.value))} className="w-16 border rounded px-2 py-1 text-center" />
            <button onClick={()=>remove(l.id)} className="text-red-500 text-sm">Retirer</button>
          </div>
        </div>
      ))}
      <div className="mt-4 space-y-1 bg-white border rounded-xl p-4">
        <div className="flex justify-between"><span>Sous-total</span><span>{cart.sousTotal} €</span></div>
        <div className="flex justify-between"><span>Livraison</span><span>{cart.fraisLivraison} €</span></div>
        <div className="flex justify-between font-bold"><span>Total TTC</span><span>{cart.totalTTC} €</span></div>
        {cart.couponCode && <div className="text-green-600 text-sm">Coupon {cart.couponCode} appliqué</div>}
      </div>
      <div className="flex gap-2 mt-4">
        <input placeholder="Code promo" value={code} onChange={e=>setCode(e.target.value)} className="flex-1 border px-3 py-2 rounded-full" />
        <button onClick={applyCoupon} className="bg-black text-white px-4 rounded-full">Appliquer</button>
        <button onClick={async()=>{await api.delete("/api/cart/coupon"); load();}} className="border px-4 rounded-full">Retirer</button>
      </div>
      {cart.lignes.length>0 && <a href="/checkout" className="block mt-6 bg-black text-white text-center py-3 rounded-full">Commander</a>}
      {msg && <div className="mt-3 text-sm text-center">{msg}</div>}
    </div>
  );
}
