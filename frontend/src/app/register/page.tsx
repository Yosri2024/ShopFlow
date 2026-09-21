"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function Register() {
  const [form, setForm] = useState({ email:"", password:"", prenom:"", nom:"", role:"CUSTOMER", nomBoutique:"" });
  const [msg, setMsg] = useState("");

  const register = async () => {
    try {
      const { data } = await api.post("/api/auth/register", form);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setMsg("Register OK - " + data.role + " -> login");
      location.href = "/login";
    } catch(e:any){ setMsg(e.response?.data?.error || JSON.stringify(e.response?.data)); }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input placeholder="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border px-3 py-2 rounded mb-2" />
      <input placeholder="password (8+ chars)" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border px-3 py-2 rounded mb-2" />
      <input placeholder="prenom" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} className="w-full border px-3 py-2 rounded mb-2" />
      <input placeholder="nom" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} className="w-full border px-3 py-2 rounded mb-2" />
      <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full border px-3 py-2 rounded mb-2">
        <option value="CUSTOMER">CUSTOMER</option><option value="SELLER">SELLER</option><option value="ADMIN">ADMIN</option>
      </select>
      {form.role==="SELLER" && <input placeholder="nom boutique" value={form.nomBoutique} onChange={e=>setForm({...form,nomBoutique:e.target.value})} className="w-full border px-3 py-2 rounded mb-2" />}
      <button onClick={register} className="w-full bg-black text-white py-2 rounded-full">Register</button>
      {msg && <div className="mt-3 text-sm border rounded p-2 bg-zinc-50 break-all">{msg}</div>}
    </div>
  );
}
