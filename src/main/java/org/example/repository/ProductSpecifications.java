package org.example.repository;

import jakarta.persistence.criteria.Join;
import org.example.entity.Category;
import org.example.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecifications {

    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) return null;
            Join<Product, Category> join = root.join("categories");
            return cb.equal(join.get("id"), categoryId);
        };
    }

    public static Specification<Product> hasSeller(Long sellerId) {
        return (root, query, cb) -> sellerId == null ? null : cb.equal(root.get("seller").get("id"), sellerId);
    }

    public static Specification<Product> priceBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min != null && max != null) return cb.between(root.get("prix"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("prix"), min);
            if (max != null) return cb.lessThanOrEqualTo(root.get("prix"), max);
            return null;
        };
    }

    public static Specification<Product> isPromo(Boolean promo) {
        return (root, query, cb) -> {
            if (promo == null) return null;
            return promo ? cb.isNotNull(root.get("prixPromo")) : cb.isNull(root.get("prixPromo"));
        };
    }

    public static Specification<Product> isActif(Boolean actif) {
        return (root, query, cb) -> actif == null ? null : cb.equal(root.get("actif"), actif);
    }

    public static Specification<Product> search(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return null;
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("nom")), like),
                    cb.like(cb.lower(root.get("description")), like)
            );
        };
    }
}
