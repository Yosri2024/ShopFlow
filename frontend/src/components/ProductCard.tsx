"use client";

import { useState } from "react";
import { Product } from "@/lib/api";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Tag } from "lucide-react";

interface ProductCardProps {
  p: Product;
  onQuickAdd?: (productId: number) => void;
}

export function ProductCard({ p, onQuickAdd }: ProductCardProps) {
  const [adding, setAdding] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onQuickAdd) return;
    setAdding(true);
    try {
      await onQuickAdd(p.id);
    } finally {
      setAdding(false);
    }
  };

  const hasPromo = p.prixPromo && p.prixPromo < p.prix;
  const discount = hasPromo && p.pourcentageRemise ? Math.round(p.pourcentageRemise) : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
      style={{ borderColor: "#CCFBF1", boxShadow: "0 4px 12px rgba(13,148,136,0.06)" }}
    >
      {/* Badge promo */}
      {hasPromo && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
        >
          <Tag className="w-3 h-3 mr-1" /> -{discount}%
        </motion.div>
      )}

      {/* Image */}
      <div className="aspect-square bg-zinc-100 relative overflow-hidden">
        {p.images?.[0] ? (
          <motion.img
            src={p.images[0]}
            alt={p.nom}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content - flex 1 to push buttons down */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name & Description - fixed height 2 lines */}
        <div className="min-h-[56px]">
          <h3 className="font-semibold line-clamp-1 text-base" style={{ color: "#0F172A", fontFamily: "var(--font-poppins)" }}>{p.nom}</h3>
          <p className="text-sm line-clamp-2 mt-1 min-h-[40px]" style={{ color: "#64748B" }}>{p.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {p.noteMoyenne && p.noteMoyenne > 0 ? (
            <>
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-medium text-zinc-700">{p.noteMoyenne.toFixed(1)}</span>
              <span className="text-xs text-zinc-400">({p.noteMoyenne >= 4 ? "Excellent" : p.noteMoyenne >= 3 ? "Bien" : "Moyen"})</span>
            </>
          ) : (
            <span className="text-xs text-zinc-400">Pas encore noté</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {p.prixPromo && p.prixPromo < p.prix ? (
            <>
              <span className="text-xl font-bold text-emerald-600">{p.prixPromo.toFixed(2)} €</span>
              <span className="text-sm line-through text-zinc-400">{p.prix.toFixed(2)} €</span>
            </>
          ) : (
            <span className="text-xl font-bold text-zinc-900">{p.prix.toFixed(2)} €</span>
          )}
        </div>

        {/* Stock indicator - fixed height */}
        <div className="flex items-center gap-1 text-xs min-h-[16px]">
          <span style={{ color: p.stock > 10 ? "#059669" : p.stock > 0 ? "#EA580C" : "#DC2626" }}>
            {p.stock > 10 ? "En stock" : p.stock > 0 ? `Plus que ${p.stock}` : "Rupture"}
          </span>
          {p.variants && p.variants.length > 0 && (
            <span style={{ color: "#94A3B8" }}>· {p.variants.length} variantes</span>
          )}
        </div>

        {/* Actions - Uiverse type1 - pinned bottom */}
        <div className="flex gap-2 pt-3 mt-auto border-t" style={{ borderColor: "#F0FDFA" }}>
          <button
            onClick={handleQuickAdd}
            disabled={adding || p.stock === 0}
            className="button type1 type1-primary flex-1"
            style={{ height: "42px", width: "auto", flex: 1 }}
          >
            <span className="btn-txt" style={{ letterSpacing: "1px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShoppingCart className="w-4 h-4" />
              {adding ? "Ajout..." : p.stock === 0 ? "Rupture" : "Ajouter"}
            </span>
          </button>
          <a href={`/products/${p.id}`} className="button type1 type1-secondary" style={{ height: "42px", width: "90px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <span className="btn-txt" style={{ letterSpacing: "2px", fontSize: "12px" }}>Voir</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function RatingStars({ note }: { note?: number }) {
  if (!note) return <span className="text-zinc-400 text-sm">Pas d avis</span>;
  const full = Math.floor(note);
  const half = note % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < full ? "fill-amber-500 text-amber-500" :
            i === full && half ? "fill-amber-500/50 text-amber-500/50" :
            "text-zinc-300"
          }`}
        />
      ))}
      <span className="text-sm font-medium text-zinc-700 ml-1">{note.toFixed(1)}</span>
    </span>
  );
}

export function OrderStatusBadge({ s }: { s: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800", PAID: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-violet-100 text-violet-800", SHIPPED: "bg-orange-100 text-orange-800",
    DELIVERED: "bg-emerald-100 text-emerald-800", CANCELLED: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[s] || "bg-zinc-100 text-zinc-700"}`}>{s}</span>;
}