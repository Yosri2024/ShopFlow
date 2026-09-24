-- ShopFlow data.sql - Données de démonstration p.6 (optionnel) - pour soutenance
-- Chargé auto via spring.sql.init.mode=always (dev H2 + prod PostgreSQL)
-- Mots de passe BCrypt pour "Password123!" = $2b$10$tbyxWR2ZWCZL25sOhETSHO0HS.EV.7p8Xnrb8zNlR/4Os7kLHwAry

-- Nettoyage si relance (évite doublons)
-- H2/PostgreSQL: MERGE ou INSERT ... ON CONFLICT ignoré via saveur Hibernate create-drop (tables déjà vides)

-- Users (ADMIN / SELLER / CUSTOMER)
INSERT INTO users (email, password, prenom, nom, role, actif, date_creation) VALUES
('admin@shopflow.com', '$2b$10$tbyxWR2ZWCZL25sOhETSHO0HS.EV.7p8Xnrb8zNlR/4Os7kLHwAry', 'Admin', 'ShopFlow', 'ADMIN', true, CURRENT_TIMESTAMP),
('seller@shopflow.com', '$2b$10$tbyxWR2ZWCZL25sOhETSHO0HS.EV.7p8Xnrb8zNlR/4Os7kLHwAry', 'Ali', 'Seller', 'SELLER', true, CURRENT_TIMESTAMP),
('customer@shopflow.com', '$2b$10$tbyxWR2ZWCZL25sOhETSHO0HS.EV.7p8Xnrb8zNlR/4Os7kLHwAry', 'Yosri', 'Customer', 'CUSTOMER', true, CURRENT_TIMESTAMP);

-- SellerProfile pour seller@shopflow.com (user_id = 2)
INSERT INTO seller_profile (user_id, nom_boutique, description, logo, note) VALUES
(2, 'ShopAli', 'Boutique démo Seller - Électronique & Mode', 'https://example.com/logo-shopali.png', 4.8);

-- Adresses pour customer
INSERT INTO address (user_id, rue, ville, code_postal, pays, principal) VALUES
(3, '123 Rue de Tunis', 'Tunis', '1000', 'Tunisie', true),
(3, '456 Avenue Habib Bourguiba', 'Sfax', '3000', 'Tunisie', false);

-- Catégories (arbre)
INSERT INTO category (nom, description, parent_id) VALUES
('Electronics', 'Produits électroniques', NULL),
('Mode', 'Vêtements & accessoires', NULL),
('Smartphones', 'Téléphones intelligents', 1),
('Laptops', 'Ordinateurs portables', 1);

-- Produits (seller_id = 2) — 9 produits pro
INSERT INTO product (seller_id, nom, description, prix, prix_promo, stock, actif, date_creation) VALUES
(2, 'Phone X', 'Smartphone 6.5" 128Go - Caméra 48MP, 5G', 699.99, 599.99, 25, true, CURRENT_TIMESTAMP),
(2, 'Laptop Pro 14"', 'Ultrabook i7 16Go 512Go SSD - 14" Retina', 1299.00, NULL, 12, true, CURRENT_TIMESTAMP),
(2, 'T-Shirt ShopFlow', 'Coton bio, édition limitée - Made in Tunisia', 29.99, 19.99, 100, true, CURRENT_TIMESTAMP),
(2, 'Casque Audio Pro', 'Bluetooth ANC, 30h autonomie', 149.99, 129.99, 40, true, CURRENT_TIMESTAMP),
(2, 'Montre Connectée', 'Sport GPS, étanche 5ATM', 199.99, NULL, 30, true, CURRENT_TIMESTAMP),
(2, 'Sneakers Urban', 'Mesh respirant, taille 42-45', 89.99, 69.99, 60, true, CURRENT_TIMESTAMP),
(2, 'Sac à Dos Tech', '15" compartiment laptop, USB', 59.99, NULL, 45, true, CURRENT_TIMESTAMP),
(2, 'Tablette 10.9"', 'IPS 2K, 64Go, stylet inclus', 349.99, 299.99, 20, true, CURRENT_TIMESTAMP),
(2, 'Enceinte Mini', 'Bass boost, 12h, IPX7', 79.99, NULL, 35, true, CURRENT_TIMESTAMP);

-- Lien produits ↔ catégories
INSERT INTO product_categories (product_id, category_id) VALUES (1, 3);
INSERT INTO product_categories (product_id, category_id) VALUES (2, 4);
INSERT INTO product_categories (product_id, category_id) VALUES (3, 2);
INSERT INTO product_categories (product_id, category_id) VALUES (4, 1);
INSERT INTO product_categories (product_id, category_id) VALUES (5, 1);
INSERT INTO product_categories (product_id, category_id) VALUES (6, 2);
INSERT INTO product_categories (product_id, category_id) VALUES (7, 2);
INSERT INTO product_categories (product_id, category_id) VALUES (8, 1);
INSERT INTO product_categories (product_id, category_id) VALUES (9, 1);

-- Images produits (vraies photos par produit - Unsplash)
INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&q=80'),
(2, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop&q=80'),
(3, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop&q=80'),
(4, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=400&fit=crop&q=80'),
(5, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80'),
(6, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&q=80'),
(7, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&q=80'),
(8, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop&q=80'),
(9, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop&q=80');

-- Variantes
INSERT INTO product_variant (product_id, attribut, valeur, stock_supplementaire, prix_delta) VALUES
(1, 'Couleur', 'Noir', 5, 0),
(1, 'Couleur', 'Blanc', 3, 10.00),
(3, 'Taille', 'M', 20, 0),
(3, 'Taille', 'L', 15, 2.00),
(6, 'Taille', '42', 10, 0),
(6, 'Taille', '44', 8, 5.00);

-- Coupons
INSERT INTO coupon (code, type, valeur, date_expiration, usages_max, usages_actuels, actif) VALUES
('PROMO10', 'PERCENT', 10.00, '2026-12-31', 100, 0, true),
('WELCOME20', 'FIXED', 20.00, '2026-12-31', 50, 0, true);

-- Avis (approuvés pour démo)
INSERT INTO review (customer_id, product_id, note, commentaire, date_creation, approuve) VALUES
(3, 1, 5, 'Excellent téléphone, livraison rapide !', CURRENT_TIMESTAMP, true),
(3, 2, 4, 'Très bon laptop, un peu cher', CURRENT_TIMESTAMP, true);
