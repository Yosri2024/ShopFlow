"use client";
import { useState, useMemo } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ email:"", password:"", prenom:"", nom:"", role:"CUSTOMER", nomBoutique:"" });
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  const strength = useMemo(()=>{
    const p = form.password;
    let s=0; if(p.length>=8) s++; if(/[A-Z]/.test(p)) s++; if(/[0-9]/.test(p)) s++; if(/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }, [form.password]);
  const strengthLabel = ["Faible","Moyen","Bon","Fort"][strength-1] || "";
  const strengthColor = ["bg-red-500","bg-amber-500","bg-emerald-500","bg-emerald-700"][strength-1] || "bg-zinc-200";

  const valid = form.email.includes("@") && form.password.length>=8 && form.prenom && form.nom;

  const register = async () => {
    try {
      const { data } = await api.post("/api/auth/register", form);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setMsg("Compte cree " + data.role);
      location.href = "/login";
    } catch(e:any){ setMsg(e.response?.data?.error || JSON.stringify(e.response?.data)); }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="bg-white border-2 rounded-2xl p-6 shadow-sm" style={{ borderColor: "#0D9488" }}>
        <h1 className="text-xl font-bold mb-1">Creation compte</h1>
        <div className="flex gap-2 mb-4 text-sm">
          <a href="/login" className="flex-1 py-2 text-center border rounded-full">Se connecter</a>
          <span className="flex-1 py-2 text-center rounded-full" style={{ background: "#F59E0B", color: "#1F2937" }}>S&apos;inscrire</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{color:"#334155"}}>Email</label>
            <input placeholder="ex: yosri@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border-2 border-[#0D9488] px-3 py-2.5 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{color:"#334155"}}>Mot de passe</label>
            <div className="relative">
              <input placeholder="8+ chars, majuscule, chiffre, symbole" type={show ? "text" : "password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border-2 border-[#0D9488] px-3 py-2.5 rounded-xl text-sm pr-10" />
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-2.5 text-zinc-400">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </div>
          {form.password && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden"><div className={`h-full ${strengthColor} transition-all`} style={{width: `${strength*25}%`}} /></div>
              <span className="text-xs text-zinc-500">{strengthLabel}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{color:"#334155"}}>Prénom</label>
              <input placeholder="ex: Yosri" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} className="w-full border-2 border-[#0D9488] px-3 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{color:"#334155"}}>Nom</label>
              <input placeholder="ex: Dkhil" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} className="w-full border-2 border-[#0D9488] px-3 py-2.5 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{color:"#334155"}}>Rôle</label>
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full border-2 border-[#0D9488] px-3 py-2.5 rounded-xl text-sm bg-white">
              <option value="CUSTOMER">CUSTOMER - Client</option><option value="SELLER">SELLER - Vendeur</option>
            </select>
          </div>
          {form.role==="SELLER" && <div><label className="block text-xs font-medium mb-1" style={{color:"#334155"}}>Nom boutique</label><input placeholder="ex: ShopAli" value={form.nomBoutique} onChange={e=>setForm({...form,nomBoutique:e.target.value})} className="w-full border-2 border-[#0D9488] px-3 py-2.5 rounded-xl text-sm" /></div>}
          <motion.button whileTap={{ scale:0.98 }} onClick={register} disabled={!valid} className="w-full py-2.5 rounded-full font-bold shadow-sm disabled:opacity-50 transition" style={{ background: !valid ? "#E2E8F0" : "#0F172A", color: !valid ? "#64748B" : "#FFFFFF", boxShadow: !valid ? "none" : "0 4px 12px rgba(15,23,42,0.25)" }}>Créer compte</motion.button>
        </div>
        {msg && <div className={`mt-3 text-sm border rounded-xl p-3 break-all flex items-center gap-2 ${msg.includes("cree") ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-600"}`}>{!msg.includes("cree") && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}<span>{msg}</span></div>}
        <p className="text-xs text-zinc-500 mt-3">En creant un compte tu acceptes <a href="/terms" className="underline">CGV</a> et <a href="/privacy" className="underline">Confidentialite</a>.</p>
      </motion.div>
    </div>
  );
}
