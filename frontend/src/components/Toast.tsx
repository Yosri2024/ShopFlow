"use client";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

export function Toast({ message, type = "error", onClose }: { message: string; type?: "error" | "success"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur ${type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`} style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
        {type === "error" ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full"><X className="w-4 h-4" /></button>
      </div>
    </motion.div>
  );
}

export function showToast(message: string, type: "error" | "success" = "error") {
  const el = document.createElement("div");
  document.body.appendChild(el);
  // This is a simple imperative API - for now we use a global event
  window.dispatchEvent(new CustomEvent("shopflow-toast", { detail: { message, type } }));
}
