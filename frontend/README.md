# ShopFlow Frontend - Next.js 15 + TypeScript

Frontend pour MiniProjet ShopFlow (Ghada Feki 2025/2026) - consomme API Spring Boot sur http://localhost:8080

## Stack
Next.js 16.3.5 (App Router, src-dir), TypeScript 5, Tailwind 4, Axios, JWT (access+refresh)

## Pages Spec p.5-6
- `/` - Accueil: produits vedette, catégories, bannière promo
- `/products` - Catalogue grille + filtres (q, prix, catégorie) + pagination
- `/products/[id]` - Fiche produit: images, variantes, avis, Ajouter panier
- `/cart` - Panier: lignes, coupon, total, Commander
- `/checkout` - Tunnel: adresse + confirmation → POST /api/orders
- `/orders` - Mes commandes + suivi statut (OrderStatusBadge) + annuler
- `/seller` - Dashboard vendeur: myProducts, pending, lowStock
- `/login` `/register` - Auth JWT (Bearer intercepteur + refresh auto)

## Composants réutilisables
`ProductCard`, `RatingStars`, `OrderStatusBadge`, `Navbar` (auth guard)

## Lancement
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
npm install
npm run dev # http://localhost:3000
npm run build
```

## Intercepteur JWT (Spec 4.3)
- `src/lib/api.ts` : request injecte Bearer, response 401 → POST /api/auth/refresh → retry
- Stockage localStorage accessToken/refreshToken

## Backend requis
Spring Boot 3.4.13 sur :8080 (voir ../README.md), endpoints /api/auth, /api/products, /api/cart, etc.
