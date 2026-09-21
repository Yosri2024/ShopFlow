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

-- Produits (seller_id = 2)
INSERT INTO product (seller_id, nom, description, prix, prix_promo, stock, actif, date_creation) VALUES
(2, 'Phone X', 'Smartphone 6.5" 128Go - Caméra 48MP', 699.99, 599.99, 25, true, CURRENT_TIMESTAMP),
(2, 'Laptop Pro 14"', 'Ultrabook i7 16Go 512Go SSD', 1299.00, NULL, 12, true, CURRENT_TIMESTAMP),
(2, 'T-Shirt ShopFlow', 'Coton bio, taille M, édition limitée', 29.99, 19.99, 100, true, CURRENT_TIMESTAMP);

-- Lien produits ↔ catégories
INSERT INTO product_categories (product_id, category_id) VALUES (1, 3);
INSERT INTO product_categories (product_id, category_id) VALUES (2, 4);
INSERT INTO product_categories (product_id, category_id) VALUES (3, 2);

-- Images produits
INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://example.com/phone-x.jpg'),
(2, 'https://example.com/laptop-pro.jpg'),
(3, 'https://example.com/tshirt.jpg');

-- Variantes
INSERT INTO product_variant (product_id, attribut, valeur, stock_supplementaire, prix_delta) VALUES
(1, 'Couleur', 'Noir', 5, 0),
(1, 'Couleur', 'Blanc', 3, 10.00),
(3, 'Taille', 'M', 20, 0),
(3, 'Taille', 'L', 15, 2.00);

-- Coupons
INSERT INTO coupon (code, type, valeur, date_expiration, usages_max, usages_actuels, actif) VALUES
('PROMO10', 'PERCENT', 10.00, '2026-12-31', 100, 0, true),
('WELCOME20', 'FIXED', 20.00, '2026-12-31', 50, 0, true);

-- Avis (approuvés pour démo)
INSERT INTO review (customer_id, product_id, note, commentaire, date_creation, approuve) VALUES
(3, 1, 5, 'Excellent téléphone, livraison rapide !', CURRENT_TIMESTAMP, true),
(3, 2, 4, 'Très bon laptop, un peu cher', CURRENT_TIMESTAMP, true);
