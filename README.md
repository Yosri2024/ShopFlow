# ShopFlow - Marketplace B2C Spring Boot 3 + Next.js

MiniProjet Ghada Feki 2025/2026 - Boutique en ligne (ADMIN/SELLER/CUSTOMER) - Duration 3 semaines

## Architecture p.4
Controller (REST @RestController) → Service (@Transactional) → Repository (JpaRepository+Specifications+Pageable) → Entity (Jakarta Persistence 3)
DTO séparés + MapStruct + @ControllerAdvice + Lombok

## Stack Backend (Spec 3.1)
Java 21, Spring Boot 3.4.13, Spring MVC, Spring Data JPA, Jakarta Validation, Lombok, PostgreSQL 18 / H2, Spring Security 6 + JWT jjwt 0.12.6, Springdoc OpenAPI 2.8.13, MapStruct 1.5.5, Maven

## Backend Endpoints p.5
- Auth: POST /api/auth/register, /login, /refresh, /logout
- Products: GET /api/products (paginé + filtres categorie/prix/vendeur/promo), GET /{id}, POST/PUT/DELETE (SELLER/ADMIN), GET /search?q=, GET /top-selling
- Categories: GET /api/categories (arbre), POST/PUT/DELETE (ADMIN)
- Cart: GET /api/cart, POST /items, PUT /items/{id}, DELETE /items/{id}, POST/DELETE /coupon
- Orders: POST /api/orders, GET /{id}, GET /my, PUT /{id}/status (SELLER/ADMIN), PUT /{id}/cancel (CUSTOMER), GET / (ADMIN)
- Reviews: POST /api/reviews, GET /product/{id}, PUT /{id}/approve (ADMIN)
- Coupons: POST/PUT/DELETE /api/coupons (ADMIN), GET /validate/{code}
- Dashboard: GET /api/dashboard/admin, /seller
- Swagger: /swagger-ui.html , /api-docs

## Lancement Backend
```bash
# Dev (H2, create-drop)
JAVA_HOME=/home/yosriii/.jdks/ms-21.0.12.1 mvn spring-boot:run
# ou
JAVA_HOME=/home/yosriii/.jdks/ms-21.0.12.1 mvn spring-boot:run -Dspring-boot.run.profiles=dev
# http://localhost:8080/swagger-ui.html , http://localhost:8080/h2-console (jdbc:h2:mem:shopflow sa/)

# Prod (PostgreSQL - voir pg_hba.conf md5)
sudo systemctl start postgresql
DB_USERNAME=shopflow DB_PASSWORD=shopflow mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Lancement Frontend (Spec 4.1 Next.js choisi)
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
npm install
npm run dev # http://localhost:3000
npm run build
```

## Tests rapides
```bash
# Register/Login
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"Password123!","prenom":"Test","nom":"User"}'
curl -X POST http://localhost:8080/api/auth/login -d '{"email":"test@test.com","password":"Password123!"}' # → accessToken

# Products (pagination obligatoire p.3)
curl http://localhost:8080/api/products?page=0&size=10
```

## Livrables p.6
- backend/ (sans target/), frontend/ (sans node_modules/.next/), rapport.pdf, README.md, shopflow.postman_collection.json, data.sql

## Postman
Import `shopflow.postman_collection.json` (voir fichier à la racine)

## Auteur
Choix Next.js justifié: SSR/SSG pour SEO catalogue, App Router, intercepteur JWT, écosystème React.
