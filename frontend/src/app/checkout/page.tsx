"use client";
import { useState } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Check, MapPin, CreditCard } from "lucide-react";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [adresse, setAdresse] = useState("123 Rue Tunis, Tunis");
  const [res, setRes] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const commander = async () => {
    try {
      const { data } = await api.post("/api/orders", { adresseLivraison: adresse });
      setRes(data);
      setMsg(`Commande ${data.numeroCommande} cree en PENDING`);
      setStep(3);
    } catch(e:any){ setMsg(e.response?.data?.error || "Panier vide ou non connecte"); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        {[{n:1,label:"Adresse",icon:MapPin},{n:2,label:"Paiement",icon:CreditCard},{n:3,label:"Confirmation",icon:Check}].map(s=> (
          <div key={s.n} className={`flex items-center gap-2 ${step>=s.n ? "text-black" : "text-zinc-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step>=s.n ? "bg-black text-white border-black" : "bg-white border-zinc-200"}`}>{s.n}</div>
            <span className="text-sm font-medium hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>

      {step===1 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Adresse livraison</h2>
          <input value={adresse} onChange={e=>setAdresse(e.target.value)} className="w-full border rounded-xl px-3 py-3 text-sm" />
          <button onClick={()=>setStep(2)} className="w-full mt-4 bg-black text-white py-3 rounded-full">Continuer vers paiement</button>
        </motion.div>
      )}

      {step===2 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Paiement simule</h2>
          <p className="text-sm text-zinc-500 mb-3">Aucun prelevement reel. Flux PENDING vers PAID simule a la creation.</p>
          <div className="bg-zinc-50 border rounded-xl p-4 text-sm">Total affiche dans panier. Coupon deja deduit si applique.</div>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>setStep(1)} className="flex-1 border py-3 rounded-full">Retour</button>
            <button onClick={commander} className="flex-1 bg-black text-white py-3 rounded-full">Confirmer commande</button>
          </div>
        </motion.div>
      )}

      {step===3 && res && (
        <motion.div initial={{ scale:0.97, opacity:0 }} animate={{ scale:1, opacity:1 }} className="bg-white border rounded-2xl p-6 shadow-sm text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6" /></div>
          <h3 className="font-bold">Commande {res.numeroCommande}</h3>
          <p className="text-sm text-zinc-500">{res.statut} — {res.totalTTC} €</p>
          <pre className="mt-3 bg-zinc-900 text-white p-3 rounded-xl text-xs overflow-auto text-left">{JSON.stringify(res,null,2)}</pre>
          <a href="/orders" className="block mt-4 bg-black text-white py-3 rounded-full">Voir mes commandes</a>
        </motion.div>
      )}

      {msg && <div className="mt-4 border rounded-xl p-3 bg-zinc-50 text-sm text-center">{msg}</div>}
    </div>
  );
}
