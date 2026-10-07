"use client";
import { useState } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Check, MapPin, CreditCard, Banknote, Wallet } from "lucide-react";

type Paiement = "ESPECE" | "CARTE_BANCAIRE" | "PAYPAL" | "VISA" | "MASTERCARD";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [adresse, setAdresse] = useState("123 Rue Tunis, Tunis");
  const [paiement, setPaiement] = useState<Paiement>("ESPECE");
  const [res, setRes] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const commander = async () => {
    try {
      const { data } = await api.post("/api/orders", { adresseLivraison: adresse, paiement });
      setRes(data);
      setMsg(`Commande ${data.numeroCommande} cree en PENDING - Paiement: ${paiement}`);
      setStep(3);
    } catch(e:any){ setMsg(e.response?.data?.error || "Panier vide ou non connecte"); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        {[{n:1,label:"Adresse",icon:MapPin},{n:2,label:"Paiement",icon:CreditCard},{n:3,label:"Confirmation",icon:Check}].map(s=> (
          <div key={s.n} className={`flex items-center gap-2 ${step>=s.n ? "text-black" : "text-zinc-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step>=s.n ? "text-white" : "bg-white"}`} style={step>=s.n ? { background: "#0D9488", borderColor: "#0D9488", color: "#FFFFFF" } : { borderColor: "#CCFBF1", color: "#64748B" }} >{s.n}</div>
            <span className="text-sm font-medium hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>

      {step===1 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-white border-2 rounded-2xl p-6 shadow-sm" style={{ borderColor: "#0D9488" }}>
          <h2 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "#0F172A" }}><MapPin className="w-4 h-4" style={{ color: "#0D9488" }} /> Adresse livraison</h2>
          <input value={adresse} onChange={e=>setAdresse(e.target.value)} className="w-full border-2 rounded-xl px-3 py-3 text-sm focus:ring-2 outline-none" style={{ borderColor: "#0D9488", background: "#F0FDFA" }} />
          <button onClick={()=>setStep(2)} className="w-full mt-4 py-3 rounded-full font-medium transition" style={{ background: "#0D9488", color: "#FFFFFF" }}>Continuer vers paiement</button>
        </motion.div>
      )}

      {step===2 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-white border-2 rounded-2xl p-6 shadow-sm" style={{ borderColor: "#0D9488" }}>
          <h2 className="font-semibold mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" style={{color:"#0D9488"}} /> Mode de paiement</h2>
          <p className="text-sm text-zinc-500 mb-3">Choisis comment tu veux payer. Aucun prélèvement réel (PENDING).</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              {id:"ESPECE", label:"Espèce", desc:"Payer à la livraison", icon:Banknote, color:"#059669"},
              {id:"CARTE_BANCAIRE", label:"Carte bancaire", desc:"CB locale", icon:CreditCard, color:"#0D9488"},
              {id:"VISA", label:"Visa", desc:"Carte Visa", icon:CreditCard, color:"#1A1F71"},
              {id:"MASTERCARD", label:"Mastercard", desc:"Mastercard", icon:CreditCard, color:"#EB001B"},
              {id:"PAYPAL", label:"PayPal", desc:"Compte PayPal", icon:Wallet, color:"#003087"},
            ].map(o => {
              const Icon = o.icon;
              const active = paiement === o.id;
              return (
                <button key={o.id} onClick={()=>setPaiement(o.id as Paiement)} className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition ${active ? "shadow-md" : "hover:shadow-sm"}`} style={active ? { borderColor: o.color, background: "#FFFFFF", boxShadow: `0 4px 12px ${o.color}20` } : { borderColor: "#E2E8F0", background: "#F8FAFC" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: active ? o.color : "#FFFFFF", color: active ? "#FFFFFF" : o.color, border: `1px solid ${o.color}20` }}><Icon className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{color: active ? "#0F172A" : "#334155"}}>{o.label}</div>
                    <div className="text-xs" style={{color:"#64748B"}}>{o.desc}</div>
                  </div>
                  {active && <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{background:o.color, color:"white"}}><Check className="w-3 h-3" /></div>}
                </button>
              );
            })}
          </div>
          <div className="bg-zinc-50 border rounded-xl p-4 text-sm flex items-center justify-between" style={{borderColor:"#E2E8F0"}}>
            <span style={{color:"#64748B"}}>Total avec livraison 5€ - coupon déjà déduit</span>
            <span className="font-bold" style={{color:"#0F172A"}}>{paiement === "ESPECE" ? "Paiement à la livraison" : paiement}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>setStep(1)} className="flex-1 border-2 py-3 rounded-full font-medium" style={{ borderColor: "#0D9488", background: "#FFFFFF", color: "#0F172A" }}>Retour</button>
            <button onClick={commander} className="flex-1 py-3 rounded-full font-bold shadow-sm" style={{ background: "#0F172A", color: "#FFFFFF" }}>Confirmer commande — {paiement === "ESPECE" ? "Espèce" : paiement === "PAYPAL" ? "PayPal" : paiement}</button>
          </div>
        </motion.div>
      )}

      {step===3 && res && (
        <motion.div initial={{ scale:0.97, opacity:0 }} animate={{ scale:1, opacity:1 }} className="bg-white border-2 rounded-2xl p-6 shadow-sm text-center" style={{ borderColor: "#0D9488" }}>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6" /></div>
          <h3 className="font-bold">Commande {res.numeroCommande}</h3>
          <p className="text-sm text-zinc-500">{res.statut} - {res.totalTTC} € — Paiement: {res.paiement || paiement}</p>
          <div className="mt-3 flex justify-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full border" style={{borderColor:"#CCFBF1", background:"#F0FDFA", color:"#0F172A"}}>{res.paiement || paiement}</span>
            <span className="px-3 py-1 rounded-full" style={{background:"#0F172A", color:"white"}}>{res.adresseLivraison}</span>
          </div>
          <a href="/orders" className="block mt-4 text-center py-3 rounded-full font-medium" style={{ background: "#0D9488", color: "#FFFFFF" }}>Voir mes commandes</a>
        </motion.div>
      )}

      {msg && <div className="mt-4 border rounded-xl p-3 bg-zinc-50 text-sm text-center">{msg}</div>}
    </div>
  );
}
