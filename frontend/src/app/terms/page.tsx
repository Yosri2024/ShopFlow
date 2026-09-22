export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 prose prose-zinc">
      <h1 className="text-2xl font-bold">Conditions Générales de Vente</h1>
      <p className="text-sm text-zinc-500">Dernière mise à jour : 22 septembre 2026 - ShopFlow</p>
      <h2 className="text-lg font-semibold mt-6">1. Objet</h2>
      <p>ShopFlow est une marketplace B2C permettant aux vendeurs de publier des produits et aux clients de passer commande. Les présentes CGV régissent toute commande sur la plateforme.</p>
      <h2 className="text-lg font-semibold">2. Commande et paiement</h2>
      <p>Le paiement est simulé (PENDING → PAID → PROCESSING → SHIPPED → DELIVERED). Aucun prélèvement réel n’est effectué en environnement de démonstration. La commande génère un numéro unique ORD-YYYY-XXXXX.</p>
      <h2 className="text-lg font-semibold">3. Livraison</h2>
      <p>Frais de livraison fixes affichés au panier (5 € démo). Délai indicatif 24 à 72h.</p>
      <h2 className="text-lg font-semibold">4. Rétractation</h2>
      <p>Annulation possible si statut PENDING ou PAID via PUT /api/orders/{"{id}"}/cancel, avec remboursement simulé et restock automatique.</p>
      <h2 className="text-lg font-semibold">5. Contact</h2>
      <p>contact@shopflow.local - Projet pédagogique Ghada Feki 2025/2026.</p>
    </div>
  );
}
