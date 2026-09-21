package org.example.repository;

import org.example.entity.Order;
import org.example.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByNumeroCommande(String numeroCommande);

    List<Order> findByCustomerId(Long customerId);

    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    List<Order> findByStatut(OrderStatus statut);

    @Query("SELECT o FROM Order o ORDER BY o.dateCommande DESC")
    List<Order> findRecentOrders(Pageable pageable);

    // Pour dashboard admin - toutes les commandes paginées
    Page<Order> findAllByOrderByDateCommandeDesc(Pageable pageable);
}
