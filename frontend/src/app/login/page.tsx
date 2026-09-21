"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("Password123!");
  const [msg, setMsg] = useState("");

  const login = async () => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);
      setMsg("Login OK - " + data.role);
      location.href = "/";
    } catch(e:any){ setMsg(e.response?.data?.error || "Erreur login"); }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" className="w-full border px-3 py-2 rounded mb-2" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" className="w-full border px-3 py-2 rounded mb-2" />
      <button onClick={login} className="w-full bg-black text-white py-2 rounded-full">Login</button>
      <p className="text-sm mt-3">Pas de compte? <a href="/register" className="underline">Register</a></p>
      {msg && <div className="mt-3 text-sm border rounded p-2 bg-zinc-50">{msg}</div>}
      <div className="mt-6 text-xs text-zinc-500">Hint: Bearer token injecté auto via api.ts intercepteur</div>
    </div>
  );
}
