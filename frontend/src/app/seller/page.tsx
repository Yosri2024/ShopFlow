"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/Skeleton";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Seller() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom:"", prix:"", stock:"", description:"" });
  const [msg, setMsg] = useState("");
  useEffect(()=>{
    api.get("/api/dashboard/seller").then(r=>setStats(r.data)).catch(()=>{});
    api.get("/api/products?size=20").then(r=>setProducts(r.data.content||r.data)).catch(()=>{});
  },[]);

  const createProduct = async () => {
    try {
      await api.post("/api/products?sellerId=2", { nom: form.nom, description: form.description, prix: Number(form.prix), stock: Number(form.stock) });
      setMsg("Produit créé"); setShowModal(false); location.reload();
    } catch(e:any){ setMsg(e.response?.data?.error || "Erreur validation"); }
  };

  const chartData = {
    labels: products.slice(0,6).map(p=>p.nom.substring(0,10)),
    datasets: [{ label: "Stock", data: products.slice(0,6).map(p=>p.stock), backgroundColor: "#18181b" }],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <FadeIn>
        <h1 className="text-2xl font-bold mb-4">Espace vendeur</h1>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <motion.div whileHover={{ y:-2 }} className="bg-white border rounded-2xl p-5 shadow-sm"><div className="text-sm text-zinc-500">Mes produits</div><div className="text-2xl font-bold">{stats?.myProducts ?? products.length}</div></motion.div>
          <motion.div whileHover={{ y:-2 }} className="bg-white border rounded-2xl p-5 shadow-sm"><div className="text-sm text-zinc-500">Commandes en attente</div><div className="text-2xl font-bold">{stats?.pendingOrders ?? "-"}</div></motion.div>
          <motion.div whileHover={{ y:-2 }} className="bg-white border rounded-2xl p-5 shadow-sm"><div className="text-sm text-zinc-500">Alerte stock faible</div><div className="text-xs mt-1">{stats?.lowStockProducts?.length ? stats.lowStockProducts.map((p:any)=>p.nom).join(", ") : "Aucune"}</div></motion.div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="bg-white border rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-semibold mb-3">Stock par produit</h3>
          {products.length>0 ? <Bar data={chartData} options={{ responsive:true, plugins:{ legend:{ display:false }}}} /> : <span className="text-sm text-zinc-400">Aucune donnée</span>}
        </div>
      </FadeIn>

      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">Mes produits</h2>
        <button onClick={()=>setShowModal(true)} className="bg-black text-white px-4 py-2 rounded-full text-sm">+ Nouveau produit</button>
      </div>
      {products.map(p=> (
        <motion.div key={p.id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-white border rounded-xl p-3 mb-2 flex justify-between items-center shadow-sm">
          <span className="text-sm">{p.nom} — {p.stock} stock — {p.prix} €</span>
          <a href={`/products/${p.id}`} className="text-sm bg-zinc-100 px-3 py-1 rounded-full hover:bg-zinc-200">Voir</a>
        </motion.div>
      ))}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold mb-3">Nouveau produit</h3>
            <input placeholder="Nom" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} className="w-full border px-3 py-2 rounded-xl mb-2" />
            <input placeholder="Prix" type="number" value={form.prix} onChange={e=>setForm({...form,prix:e.target.value})} className="w-full border px-3 py-2 rounded-xl mb-2" />
            <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="w-full border px-3 py-2 rounded-xl mb-2" />
            <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border px-3 py-2 rounded-xl mb-3" />
            <div className="flex gap-2">
              <button onClick={createProduct} className="flex-1 bg-black text-white py-2 rounded-full">Créer</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 border py-2 rounded-full">Annuler</button>
            </div>
            {msg && <div className="mt-2 text-sm text-red-600">{msg}</div>}
          </motion.div>
        </div>
      )}
    </div>
  );
}
