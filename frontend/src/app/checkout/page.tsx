"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function Checkout() {
  const [adresse, setAdresse] = useState("123 Rue Tunis, Tunis");
  const [res, setRes] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const commander = async () => {
    try {
      const { data } = await api.post("/api/orders", { adresseLivraison: adresse });
      setRes(data);
      setMsg(`Commande ${data.numeroCommande} créée - ${data.statut}`);
    } catch(e:any){ setMsg(e.response?.data?.error || "Erreur commande - panier vide ?"); }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Tunnel de commande</h1>
      <div className="bg-white border rounded-xl p-4">
        <label className="text-sm">Adresse livraison</label>
        <input value={adresse} onChange={e=>setAdresse(e.target.value)} className="w-full border px-3 py-2 rounded mt-1" />
        <button onClick={commander} className="w-full mt-4 bg-black text-white py-2 rounded-full">Confirmer commande</button>
      </div>
      {msg && <div className="mt-4 border rounded p-3 bg-zinc-50 text-sm">{msg}</div>}
      {res && <pre className="mt-4 bg-black text-white p-3 rounded text-xs overflow-auto">{JSON.stringify(res,null,2)}</pre>}
      <a href="/orders" className="block mt-4 text-center underline text-sm">Voir mes commandes</a>
    </div>
  );
}
