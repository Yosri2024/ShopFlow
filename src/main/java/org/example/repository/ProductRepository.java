package org.example.repository;

import org.example.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Page<Product> findByActifTrue(Pageable pageable);

    Page<Product> findBySellerId(Long sellerId, Pageable pageable);

    List<Product> findByPrixPromoIsNotNull();

    // Recherche plein texte (p.3 : nom, description) - JPQL
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.nom) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Product> search(@Param("q") String q, Pageable pageable);

    // Filtres prix + catégorie via Specifications, mais aussi JPQL simple
    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.id = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.prix BETWEEN :min AND :max")
    Page<Product> findByPrixBetween(@Param("min") BigDecimal min, @Param("max") BigDecimal max, Pageable pageable);

    // Top 10 meilleures ventes (via OrderItem)
    @Query("SELECT oi.product.id, COUNT(oi) as cnt FROM OrderItem oi GROUP BY oi.product.id ORDER BY cnt DESC")
    List<Object[]> findTopSellingIds(Pageable pageable);

    default List<Long> findTopSellingProductIds() {
        return findTopSellingIds(org.springframework.data.domain.PageRequest.of(0, 10))
                .stream().map(o -> (Long) o[0]).toList();
    }
}
