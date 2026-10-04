# 🛒 ShopFlow

> Marketplace B2C full-stack : API REST **Spring Boot 3** + interface **Next.js**, avec trois rôles (Admin, Vendeur, Client).

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-ready-336791)

ShopFlow permet à des vendeurs de publier des produits et à des clients de les acheter : catalogue paginé avec filtres, panier, coupons, commandes, avis modérés et tableaux de bord de ventes.

---

## ✨ Fonctionnalités

| Rôle | Ce qu'il peut faire |
|------|---------------------|
| **Client** | Parcourir et rechercher les produits, gérer son panier, appliquer un coupon, passer et annuler une commande, laisser un avis |
| **Vendeur** | Créer / modifier / supprimer ses produits, suivre ses commandes et faire évoluer leur statut, consulter son tableau de bord |
| **Admin** | Gérer les catégories et les coupons, modérer les avis, voir toutes les commandes, consulter le tableau de bord global |

Autres points :
- Authentification **JWT** (access token 1 h + refresh token 7 j)
- Catalogue **paginé** avec filtres (catégorie, prix, vendeur, promo) et recherche
- Catégories organisées en **arbre** (parent / sous-catégories)
- Cycle de vie d'une commande : `PENDING → PAID → PROCESSING → SHIPPED → DELIVERED` (ou `CANCELLED`)
- Coupons de type pourcentage ou montant fixe
- Documentation interactive **Swagger UI**
- Jeu de données de démonstration chargé automatiquement

---

## 🧱 Stack technique

**Backend**
- Java 21, Spring Boot 3.4 (Web, Data JPA, Validation, Security)
- JWT avec [jjwt](https://github.com/jwtk/jjwt) 0.12
- MapStruct + Lombok
- H2 (développement) / PostgreSQL (production)
- Springdoc OpenAPI (Swagger)
- Maven

**Frontend**
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- Axios, Chart.js, Framer Motion, Lucide

### Architecture backend

```
Controller (REST)  →  Service (@Transactional)  →  Repository (JPA + Specifications)  →  Entity
        ↑                                                                    
       DTO + Mapper (MapStruct)        GlobalExceptionHandler (@ControllerAdvice)
```

```
ShopFlow/
├── src/main/java/org/example/
│   ├── controller/   # Endpoints REST
│   ├── service/      # Logique métier
│   ├── repository/   # Accès aux données (+ ProductSpecifications)
│   ├── entity/       # Entités JPA
│   ├── dto/          # Objets d'échange requête / réponse
│   ├── mapper/       # MapStruct
│   ├── security/     # JWT, filtre d'authentification
│   ├── config/       # SecurityConfig (CORS, règles d'accès)
│   └── exception/    # Gestion centralisée des erreurs
├── src/main/resources/
│   ├── application.yml   # Profils dev / prod
│   └── data.sql          # Données de démonstration
├── frontend/             # Application Next.js
├── shopflow.postman_collection.json
└── rapport.pdf
```

---

## 🚀 Démarrage rapide

### Prérequis
- JDK **21**
- Maven 3.9+
- Node.js **20+** et npm
- (Optionnel) PostgreSQL pour le profil `prod`

### 1. Backend (profil `dev`, base H2 en mémoire)

```bash
mvn spring-boot:run
```

L'API démarre sur **http://localhost:8080**

| Ressource | URL |
|-----------|-----|
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Documentation OpenAPI | http://localhost:8080/api-docs |
| Console H2 | http://localhost:8080/h2-console (`jdbc:h2:mem:shopflow`, utilisateur `sa`, mot de passe vide) |

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local      # puis adaptez l'URL de l'API si besoin
npm install
npm run dev
```

L'interface est disponible sur **http://localhost:3000**

### 3. Production (PostgreSQL)

```bash
# Créer la base "shopflow" puis :
export DB_USERNAME=shopflow
export DB_PASSWORD=votre_mot_de_passe
export JWT_SECRET=$(openssl rand -base64 32)
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## 👤 Comptes de démonstration

Créés automatiquement par `data.sql`. Mot de passe commun : `Password123!`

| Rôle | Email |
|------|-------|
| Admin | `admin@shopflow.com` |
| Vendeur | `seller@shopflow.com` |
| Client | `customer@shopflow.com` |

> ⚠️ Ces comptes sont destinés au développement uniquement. Ne les conservez pas en production.

---

## 📡 API REST

| Domaine | Endpoints principaux |
|---------|----------------------|
| **Auth** | `POST /api/auth/register` · `/login` · `/refresh` · `/logout` |
| **Produits** | `GET /api/products` (pagination + filtres) · `GET /{id}` · `GET /search?q=` · `GET /top-selling` · `POST` `PUT` `DELETE` (Vendeur / Admin) |
| **Catégories** | `GET /api/categories` (arbre) · `POST` `PUT` `DELETE` (Admin) |
| **Panier** | `GET /api/cart` · `POST /items` · `PUT /items/{id}` · `DELETE /items/{id}` · `POST` `DELETE /coupon` |
| **Commandes** | `POST /api/orders` · `GET /my` · `GET /{id}` · `PUT /{id}/cancel` (Client) · `PUT /{id}/status` (Vendeur / Admin) · `GET /` (Admin) |
| **Avis** | `POST /api/reviews` · `GET /product/{id}` · `PUT /{id}/approve` (Admin) |
| **Coupons** | `GET /api/coupons/validate/{code}` · `POST` `PUT` `DELETE` (Admin) |
| **Dashboard** | `GET /api/dashboard/admin` · `GET /api/dashboard/seller` |

Exemple rapide :

```bash
# Connexion
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@shopflow.com","password":"Password123!"}'

# Liste paginée des produits
curl "http://localhost:8080/api/products?page=0&size=10"
```

Une collection **Postman** prête à l'emploi est fournie : importez `shopflow.postman_collection.json`.

---

## 🖥️ Pages du frontend

`/` Accueil · `/products` Catalogue · `/products/[id]` Détail produit · `/cart` Panier · `/checkout` Paiement · `/orders` Mes commandes · `/seller` Espace vendeur · `/login` · `/register` · `/terms` · `/privacy` · `/cgu`

---

## ⚠️ Limites connues

- Le paiement est **simulé** (pas d'intégration d'un vrai prestataire).
- La couverture de tests automatisés est à compléter (`src/test` est vide).
- La configuration CORS est ouverte à toutes les origines : à restreindre pour un déploiement réel.

## 🗺️ Pistes d'amélioration

- Tests unitaires et d'intégration (JUnit, Testcontainers)
- Conteneurisation (Docker Compose : API + frontend + PostgreSQL)
- Upload d'images produits
- Intégration d'un paiement réel (Stripe, etc.)

---

## 📄 Licence

Distribué sous licence **MIT**. Voir le fichier [LICENSE](LICENSE).

Projet réalisé dans le cadre de l'année universitaire 2025/2026.
