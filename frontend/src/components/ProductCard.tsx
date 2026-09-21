import { Product } from "@/lib/api";

export function ProductCard({ p }: { p: Product }) {
  return (
    <div className="rounded-xl border p-4 hover:shadow-lg transition bg-white dark:bg-zinc-900">
      <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded mb-3 flex items-center justify-center text-zinc-400">
        {p.images?.[0] ? <img src={p.images[0]} alt={p.nom} className="h-full object-cover rounded" /> : "No image"}
      </div>
      <h3 className="font-semibold line-clamp-1">{p.nom}</h3>
      <p className="text-sm text-zinc-500 line-clamp-1">{p.description}</p>
      <div className="flex items-center gap-2 mt-2">
        {p.prixPromo ? (
          <>
            <span className="font-bold text-green-600">{p.prixPromo} €</span>
            <span className="line-through text-sm text-zinc-400">{p.prix} €</span>
            <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">-{p.pourcentageRemise}%</span>
          </>
        ) : (
          <span className="font-bold">{p.prix} €</span>
        )}
      </div>
      {p.noteMoyenne && <div className="text-xs text-amber-500">★ {p.noteMoyenne.toFixed(1)}/5</div>}
      <a href={`/products/${p.id}`} className="mt-3 block text-center bg-black text-white rounded-full py-2 text-sm hover:bg-zinc-800">Voir</a>
    </div>
  );
}

export function RatingStars({ note }: { note?: number }) {
  if (!note) return <span className="text-zinc-400 text-sm">Pas d avis</span>;
  return <span className="text-amber-500">{"★".repeat(Math.round(note))} {note.toFixed(1)}</span>;
}

export function OrderStatusBadge({ s }: { s: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800", PAID: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800", SHIPPED: "bg-orange-100 text-orange-800",
    DELIVERED: "bg-green-100 text-green-800", CANCELLED: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-1 rounded-full text-xs ${colors[s] || "bg-zinc-100"}`}>{s}</span>;
}
