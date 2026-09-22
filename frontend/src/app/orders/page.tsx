"use client";
import { useEffect, useState } from "react";
import api, { Order } from "@/lib/api";
import { OrderStatusBadge } from "@/components/ProductCard";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(()=>{ api.get("/api/orders/my").then(r=>setOrders(r.data)).catch(e=>setMsg(e.response?.data?.error||"Connecte-toi")); }, []);

  const cancel = async (id:number) => {
    try { await api.put(`/api/orders/${id}/cancel`); location.reload(); } catch(e:any){ setMsg(e.response?.data?.error); }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Mes commandes</h1>
      {msg && <div className="mb-3 text-sm border rounded p-2">{msg}</div>}
      {orders.length===0 ? <div className="bg-white border rounded-xl p-10 text-center text-zinc-500">Aucune commande</div> :
       orders.map(o=> (
         <div key={o.id} className="bg-white border rounded-xl p-4 mb-3">
           <div className="flex justify-between"><span className="font-mono text-sm">{o.numeroCommande}</span><OrderStatusBadge s={o.statut} /></div>
           <div className="text-sm text-zinc-500">{new Date(o.dateCommande).toLocaleString()} - {o.totalTTC} €</div>
           <div className="text-xs mt-1">{o.lignes.map(l=> `${l.productNom} x ${l.quantite}`).join(", ")}</div>
           {(o.statut==="PENDING"||o.statut==="PAID") && <button onClick={()=>cancel(o.id)} className="mt-2 text-xs text-red-500 border border-red-200 px-2 py-1 rounded-full">Annuler</button>}
         </div>
       ))}
      <div className="mt-6">
        <h2 className="font-semibold">Admin: toutes commandes</h2>
        <a href="/seller" className="text-sm underline">Espace vendeur</a> | <span className="text-xs text-zinc-500"> GET /api/orders (ADMIN) via Swagger</span>
      </div>
    </div>
  );
}
