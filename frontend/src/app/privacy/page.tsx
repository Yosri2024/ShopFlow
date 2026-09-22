export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 prose prose-zinc">
      <h1 className="text-2xl font-bold">Politique de Confidentialité</h1>
      <p className="text-sm text-zinc-500">22 septembre 2026 — ShopFlow</p>
      <h2 className="text-lg font-semibold mt-6">Données collectées</h2>
      <p>Email, nom, prénom, adresses de livraison, historique commandes. Stockées en PostgreSQL/H2, mot de passe haché BCrypt, JWT access 1h / refresh 7j.</p>
      <h2 className="text-lg font-semibold">Finalité</h2>
      <p>Gestion des commandes, panier persistant, avis. Aucune revente à des tiers.</p>
      <h2 className="text-lg font-semibold">Sécurité</h2>
      <p>Spring Security 6 stateless, filtre JWT, HTTPS recommandé en production (secret via env JWT_SECRET).</p>
      <h2 className="text-lg font-semibold">Droits</h2>
      <p>Accès, rectification, suppression sur demande à privacy@shopflow.local. Données démo supprimées à chaque redémarrage H2 create-drop.</p>
    </div>
  );
}
