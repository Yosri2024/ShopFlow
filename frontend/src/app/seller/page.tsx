"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/Skeleton";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Package, ShoppingBag, LayoutDashboard, Plus, Eye, Truck, CheckCircle } from "lucide-react";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Seller() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "dashboard"|"produits"|"commandes") || "dashboard";
  const [tab, setTab] = useState<"dashboard"|"produits"|"commandes">(initialTab);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom:"", prix:"", stock:"", description:"", categorie:"1" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "SELLER") {
      router.push("/login");
      return;
    }
    load();
  }, [router]);

  const load = () => {
    api.get("/api/dashboard/seller").then(r=>setStats(r.data)).catch(()=>{});
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    api.get("/api/products?size=100").then(r=>{
      const all = r.data.content || r.data;
      // seller voit seulement ses produits (filtre par sellerId si userId connu, sinon fallback stats)
      const filtered = userId ? all.filter((p:any)=> String(p.sellerId) === String(userId)) : all;
      setProducts(filtered.length ? filtered : all);
    }).catch(()=>{});
    api.get("/api/orders?page=0&size=20").then(r=>setOrders(r.data.content||r.data)).catch(()=>{});
  };
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ const t = searchParams.get("tab"); if(t==="produits"||t==="commandes"||t==="dashboard") setTab(t as any); },[searchParams]);

  const createProduct = async () => {
    try {
      await api.post("/api/products", { nom: form.nom, description: form.description, prix: Number(form.prix), stock: Number(form.stock), categoryIds: [Number(form.categorie)] });
      setMsg("Produit créé"); setShowModal(false); load();
    } catch(e:any){ setMsg(e.response?.data?.error || "Erreur validation"); }
  };

  const updateStatus = async (id:number, statut:string) => {
    try { await api.put(`/api/orders/${id}/status`, { statut }); load(); } catch(e:any){ alert(e.response?.data?.error || "Erreur"); }
  };

  const chartData = {
    labels: products.slice(0,6).map(p=>p.nom.substring(0,10)),
    datasets: [{ label: "Stock", data: products.slice(0,6).map(p=>p.stock), backgroundColor: "#0D9488", borderRadius: 6 }],
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{color:"#0F172A"}}>Espace Vendeur</h1>
        <span className="px-3 py-1 rounded-full text-xs border" style={{borderColor:"#0D9488", borderWidth: "2px", background:"#F0FDFA", color:"#0D9488"}}>SELLER</span>
      </div>

      {/* Tabs like customer */}
      <div className="flex gap-2 mb-6 p-1 bg-zinc-100 rounded-full w-fit">
        {[
          {id:"dashboard", label:"Dashboard", icon:LayoutDashboard},
          {id:"produits", label:"Mes Produits", icon:Package},
          {id:"commandes", label:"Commandes", icon:ShoppingBag},
        ].map(t => {
          const Icon=t.icon;
          const active=tab===t.id;
          return <button key={t.id} onClick={()=>setTab(t.id as any)} className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${active?"shadow-sm":""}`} style={active?{background:"#0F172A",color:"white"}:{background:"transparent",color:"#64748B"}}><Icon className="w-4 h-4"/>{t.label}</button>
        })}
      </div>

      {tab==="dashboard" && (
        <>
          <FadeIn>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <motion.div whileHover={{ y:-2 }} className="bg-white border-2 rounded-2xl p-5 shadow-sm" style={{ borderColor: "#0D9488" }}><div className="text-sm" style={{color:"#64748B"}}>Mes produits</div><div className="text-2xl font-bold" style={{color:"#0F172A"}}>{stats?.myProducts ?? products.length}</div><div className="text-xs mt-1" style={{color:"#94A3B8"}}>En catalogue</div></motion.div>
              <motion.div whileHover={{ y:-2 }} className="bg-white border-2 rounded-2xl p-5 shadow-sm" style={{ borderColor: "#0D9488" }}><div className="text-sm" style={{color:"#64748B"}}>Commandes</div><div className="text-2xl font-bold" style={{color:"#0F172A"}}>{orders.length}</div><div className="text-xs mt-1" style={{color:"#94A3B8"}}>Total reçues</div></motion.div>
              <motion.div whileHover={{ y:-2 }} className="bg-white border-2 rounded-2xl p-5 shadow-sm" style={{ borderColor: "#0D9488" }}><div className="text-sm" style={{color:"#64748B"}}>Stock faible</div><div className="text-xs mt-2" style={{color: stats?.lowStockProducts?.length ? "#DC2626" : "#059669"}}>{stats?.lowStockProducts?.length ? stats.lowStockProducts.map((p:any)=>p.nom).join(", ") : "Aucune alerte"}</div></motion.div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-white border-2 rounded-2xl p-5 mb-6 shadow-sm" style={{ borderColor: "#0D9488" }}>
              <h3 className="font-semibold mb-3" style={{color:"#0F172A"}}>Stock par produit</h3>
              {products.length>0 ? <Bar data={chartData} options={{ responsive:true, plugins:{ legend:{ display:false }}}} /> : <span className="text-sm" style={{color:"#94A3B8"}}>Aucune donnée</span>}
            </div>
          </FadeIn>
          <div className="bg-white border-2 rounded-2xl p-5 shadow-sm" style={{ borderColor: "#0D9488" }}>
            <h3 className="font-semibold mb-3" style={{color:"#0F172A"}}>Chiffre d'affaires (admin)</h3>
            <div className="text-2xl font-bold" style={{color:"#0D9488"}}>{stats?.chiffreAffaires ? `${stats.chiffreAffaires} €` : "-"}</div>
            <p className="text-xs mt-1" style={{color:"#64748B"}}>Visible aussi dans /api/dashboard/admin pour ADMIN</p>
          </div>
        </>
      )}

      {tab==="produits" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold" style={{ color: "#0F172A" }}>Mes produits ({products.length})</h2>
            <button onClick={()=>setShowModal(true)} className="px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2" style={{ background: "#0D9488", color: "#FFFFFF" }}><Plus className="w-4 h-4"/> Nouveau produit</button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {products.map(p=> (
              <motion.div key={p.id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-white border-2 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition" style={{ borderColor: "#0D9488" }}>
                <img src={p.images?.[0] || "https://via.placeholder.com/80"} alt={p.nom} className="w-20 h-20 rounded-xl object-cover border" style={{borderColor:"#F1F5F9"}}/>
                <div className="flex-1">
                  <div className="font-semibold" style={{color:"#0F172A"}}>{p.nom}</div>
                  <div className="text-xs line-clamp-1" style={{color:"#64748B"}}>{p.description}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs"><span className="px-2 py-0.5 rounded-full border" style={{borderColor:"#0D9488", borderWidth: "2px", background:"#F0FDFA", color:"#0D9488"}}>{p.stock} stock</span><span className="font-bold" style={{color:"#0F172A"}}>{p.prix} €</span>{p.prixPromo && <span className="line-through" style={{color:"#94A3B8"}}>{p.prixPromo} €</span>}</div>
                </div>
                <a href={`/products/${p.id}`} className="self-center px-3 py-1.5 rounded-full text-xs border bg-white hover:bg-zinc-50 flex items-center gap-1" style={{borderColor:"#E2E8F0"}}><Eye className="w-3 h-3"/> Voir</a>
              </motion.div>
            ))}
          </div>
          {products.length===0 && <div className="text-center py-10 text-sm border-2 rounded-2xl bg-white mt-4" style={{color:"#64748B", borderColor: "#0D9488"}}>Aucun produit - clique Nouveau produit</div>}
        </>
      )}

      {tab==="commandes" && (
        <>
          <h2 className="font-semibold mb-4" style={{color:"#0F172A"}}>Commandes reçues ({orders.length})</h2>
          <div className="space-y-3">
            {orders.length===0 ? <div className="bg-white border-2 rounded-2xl p-10 text-center text-sm" style={{borderColor: "#0D9488", color:"#64748B"}}>Aucune commande</div> :
              orders.map((o:any)=> (
                <div key={o.id} className="bg-white border-2 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm" style={{ borderColor: "#0D9488" }}>
                  <div>
                    <div className="font-mono text-sm font-bold" style={{color:"#0F172A"}}>{o.numeroCommande} <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{background: o.statut==="PENDING"?"#FEF3C7": o.statut==="DELIVERED"?"#DCFCE7":"#F1F5F9", color: o.statut==="PENDING"?"#92400E": o.statut==="DELIVERED"?"#065F46":"#334155"}}>{o.statut}</span> <span className="ml-1 px-2 py-0.5 rounded-full text-xs border" style={{borderColor:"#CCFBF1", color:"#0D9488"}}>{o.paiement || "ESPECE"}</span></div>
                    <div className="text-xs mt-1" style={{color:"#64748B"}}>{o.adresseLivraison} • {o.totalTTC} € • {new Date(o.dateCommande).toLocaleDateString()}</div>
                    <div className="text-xs" style={{color:"#94A3B8"}}>{o.lignes?.length} articles</div>
                  </div>
                  <div className="flex gap-2">
                    {o.statut==="PENDING" && <><button onClick={()=>updateStatus(o.id,"PAID")} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{background:"#0D9488", color:"white"}}>Marquer PAID</button><button onClick={()=>updateStatus(o.id,"PROCESSING")} className="px-3 py-1.5 rounded-full text-xs border" style={{borderColor:"#E2E8F0"}}>Processing</button></>}
                    {o.statut==="PAID" && <button onClick={()=>updateStatus(o.id,"SHIPPED")} className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1" style={{background:"#0F172A", color:"white"}}><Truck className="w-3 h-3"/> Shipped</button>}
                    {o.statut==="SHIPPED" && <button onClick={()=>updateStatus(o.id,"DELIVERED")} className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1" style={{background:"#059669", color:"white"}}><CheckCircle className="w-3 h-3"/> Livré</button>}
                    <a href={`/orders`} className="px-3 py-1.5 rounded-full text-xs border bg-white" style={{borderColor:"#E2E8F0"}}>Détail</a>
                  </div>
                </div>
              ))
            }
          </div>
        </>
      )}

      <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: "rgba(13,148,136,0.15)", backdropFilter: "blur(4px)" }}>
          <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold mb-1" style={{color:"#0F172A"}}>Nouveau produit</h3>
            <p className="text-xs mb-3" style={{color:"#64748B"}}>Visible immédiatement dans le catalogue</p>
            <div className="space-y-2">
              <div><label className="text-xs font-medium" style={{color:"#334155"}}>Nom *</label><input placeholder="ex: Phone Z" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} className="w-full border-2 px-3 py-2.5 rounded-xl text-sm mt-1" style={{borderColor:"#0D9488"}}/></div>
              <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-medium" style={{color:"#334155"}}>Prix (€) *</label><input placeholder="99.99" type="number" value={form.prix} onChange={e=>setForm({...form,prix:e.target.value})} className="w-full border-2 px-3 py-2.5 rounded-xl text-sm mt-1" style={{borderColor:"#0D9488"}}/></div><div><label className="text-xs font-medium" style={{color:"#334155"}}>Stock *</label><input placeholder="25" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="w-full border-2 px-3 py-2.5 rounded-xl text-sm mt-1" style={{borderColor:"#0D9488"}}/></div></div>
              <div><label className="text-xs font-medium" style={{color:"#334155"}}>Catégorie</label><select value={form.categorie} onChange={e=>setForm({...form,categorie:e.target.value})} className="w-full border-2 px-3 py-2.5 rounded-xl text-sm mt-1 bg-white" style={{borderColor:"#0D9488"}}><option value="1">Electronics (1)</option><option value="2">Mode (2)</option><option value="3">Smartphones (3)</option><option value="4">Laptops (4)</option></select></div>
              <div><label className="text-xs font-medium" style={{color:"#334155"}}>Description</label><textarea placeholder="Description courte..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border-2 px-3 py-2.5 rounded-xl text-sm mt-1" rows={2} style={{borderColor:"#0D9488"}}/></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={createProduct} className="flex-1 py-2.5 rounded-full font-bold" style={{ background: "#0D9488", color: "#FFFFFF" }}>Créer</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 border-2 py-2.5 rounded-full font-medium" style={{ borderColor: "#0D9488", background: "#FFFFFF", color: "#0F172A" }}>Annuler</button>
            </div>
            {msg && <div className="mt-3 text-sm p-2 rounded-xl text-center" style={{background: msg.includes("créé")?"#ECFDF5":"#FEF2F2", color: msg.includes("créé")?"#065F46":"#DC2626", border:"1px solid", borderColor: msg.includes("créé")?"#A7F3D0":"#FECACA"}}>{msg}</div>}
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
