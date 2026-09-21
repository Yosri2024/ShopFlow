"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Seller() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  useEffect(()=>{
    api.get("/api/dashboard/seller").then(r=>setStats(r.data)).catch(()=>{});
    api.get("/api/products?size=10").then(r=>setProducts(r.data.content||r.data)).catch(()=>{});
  },[]);
  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Espace vendeur</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4"><div className="text-sm text-zinc-500">Mes produits</div><div className="text-xl font-bold">{stats?.myProducts ?? "-"}</div></div>
        <div className="bg-white border rounded-xl p-4"><div className="text-sm text-zinc-500">Commandes en attente</div><div className="text-xl font-bold">{stats?.pendingOrders ?? "-"}</div></div>
        <div className="bg-white border rounded-xl p-4"><div className="text-sm text-zinc-500">Alerte stock faible</div><div className="text-xs">{stats?.lowStockProducts?.length ? stats.lowStockProducts.map((p:any)=>p.nom).join(", ") : "Aucune"}</div></div>
      </div>
      <h2 className="font-semibold mb-2">Mes produits</h2>
      {products.map(p=> <div key={p.id} className="bg-white border rounded p-3 mb-2 flex justify-between"><span>{p.nom} — {p.stock} stock</span><a href={`/products/${p.id}`} className="text-sm underline">Voir</a></div>)}
      <div className="mt-4 p-3 bg-zinc-50 border rounded text-sm">Gestion produits: POST /api/products (SELLER) via Swagger ou via /products/[id] edit (à implémenter)</div>
    </div>
  );
}
