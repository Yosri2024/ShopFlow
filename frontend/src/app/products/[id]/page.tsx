"use client";
import { useEffect, useState } from "react";
import api, { Product } from "@/lib/api";
import { RatingStars } from "@/components/ProductCard";
import { useParams } from "next/navigation";

export default function FicheProduit() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get(`/api/products/${id}`).then(r=>setP(r.data)).catch(()=>setMsg("Produit introuvable"));
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post("/api/cart/items", { productId: Number(id), quantite: qty });
      setMsg("Ajouté au panier ✓");
    } catch(e:any){ setMsg(e.response?.data?.error || "Erreur - connecte-toi"); }
  };

  if (!p) return <div className="p-10 text-center">{msg || "Chargement..."}</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 grid md:grid-cols-2 gap-6">
      <div className="h-80 bg-zinc-100 rounded-xl flex items-center justify-center">
        {p.images?.[0] ? <img src={p.images[0]} alt={p.nom} className="h-full object-cover rounded-xl" /> : "No image"}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{p.nom}</h1>
        <p className="text-zinc-500 mt-2">{p.description}</p>
        <div className="mt-3">
          {p.prixPromo ? <><span className="text-xl font-bold text-green-600">{p.prixPromo} €</span> <span className="line-through text-zinc-400">{p.prix} €</span></> : <span className="text-xl font-bold">{p.prix} €</span>}
          <div className="text-sm mt-1">Stock: {p.stock} | <RatingStars note={p.noteMoyenne} /></div>
        </div>
        {p.variants?.length>0 && (
          <div className="mt-3">
            <div className="text-sm font-medium">Variantes:</div>
            {p.variants.map(v=> <span key={v.id} className="inline-block border rounded-full px-2 py-1 text-xs mr-1">{v.attribut}: {v.valeur} (+{v.prixDelta} €)</span>)}
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))} className="border rounded-full w-20 px-3 py-2 text-center" />
          <button onClick={addToCart} className="flex-1 bg-black text-white rounded-full py-2">Ajouter au panier</button>
        </div>
        {msg && <div className="mt-3 text-sm text-center border rounded p-2 bg-zinc-50">{msg}</div>}
        <div className="mt-6">
          <h3 className="font-semibold">Avis</h3>
          <p className="text-sm text-zinc-500">Connecte-toi, achète, puis laisse un avis 1-5 via POST /api/reviews</p>
        </div>
      </div>
    </div>
  );
}
