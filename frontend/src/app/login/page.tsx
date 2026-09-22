"use client";
import { useState } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("customer@shopflow.com");
  const [password, setPassword] = useState("Password123!");
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPass = password.length >= 8;

  const login = async () => {
    if (!validEmail || !validPass) { setMsg("Email invalide ou mot de passe trop court"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);
      setMsg("Login OK " + data.role);
      location.href = "/";
    } catch(e:any){ setMsg(e.response?.data?.error || "Erreur login"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="bg-white border rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-1">Connexion</h1>
        <p className="text-sm text-zinc-500 mb-4">Accede a ton panier et commandes</p>
        <div className="space-y-3">
          <div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" className={`w-full border px-3 py-2.5 rounded-xl text-sm ${!validEmail && email ? "border-red-300" : "border-zinc-200"}`} />
            {!validEmail && email && <div className="text-xs text-red-500 mt-1">Email invalide</div>}
          </div>
          <div className="relative">
            <input type={show ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="mot de passe" className="w-full border border-zinc-200 px-3 py-2.5 rounded-xl text-sm pr-10" />
            <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-2.5 text-zinc-400">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
          <motion.button whileTap={{ scale:0.98 }} onClick={login} disabled={loading || !validEmail || !validPass} className="w-full bg-black text-white py-2.5 rounded-full font-medium disabled:bg-zinc-300 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null} {loading ? "Connexion..." : "Se connecter"}
          </motion.button>
        </div>
        <p className="text-sm mt-4 text-center">Pas de compte? <a href="/register" className="underline font-medium">Creer un compte</a></p>
        {msg && <div className="mt-3 text-sm border rounded-xl p-3 bg-zinc-50 break-all">{msg}</div>}
        <div className="mt-4 text-xs text-zinc-500 bg-amber-50 border border-amber-200 rounded-xl p-3">Demo: seller@shopflow.com / admin@shopflow.com / customer@shopflow.com — mot de passe: <b>Password123!</b></div>
      </motion.div>
    </div>
  );
}
