package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.OrderResponse;
import org.example.dto.OrderItemResponse;
import org.example.entity.*;
import org.example.enums.OrderStatus;
import org.example.enums.PaymentMethod;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // POST /api/orders - passer commande depuis panier p.3
    public OrderResponse createOrder(Long addressId, String adresseTexte, PaymentMethod paiement) {
        User u = currentUser();
        Cart cart = cartRepository.findByCustomerId(u.getId()).orElseThrow(() -> new IllegalArgumentException("Panier vide"));
        if (cart.getLignes().isEmpty()) throw new IllegalArgumentException("Panier vide");

        // Vérification stock finale p.3
        for (CartItem ci : cart.getLignes()) {
            int stock = ci.getProduct().getStock() + (ci.getVariant() != null ? ci.getVariant().getStockSupplementaire() : 0);
            if (stock < ci.getQuantite()) throw new IllegalArgumentException("Stock insuffisant pour " + ci.getProduct().getNom());
        }

        String adresse = adresseTexte;
        if (addressId != null) {
            Address a = addressRepository.findById(addressId).orElseThrow(() -> new ResourceNotFoundException("Address not found"));
            adresse = a.getRue() + ", " + a.getVille() + " " + a.getCodePostal() + ", " + a.getPays();
        }

        Order order = Order.builder()
                .customer(u)
                .statut(OrderStatus.PENDING)
                .paiement(paiement != null ? paiement : PaymentMethod.ESPECE)
                .adresseLivraison(adresse)
                .dateCommande(LocalDateTime.now())
                .build();

        BigDecimal sousTotal = BigDecimal.ZERO;
        for (CartItem ci : cart.getLignes()) {
            BigDecimal prix = ci.getProduct().getPrixPromo() != null ? ci.getProduct().getPrixPromo() : ci.getProduct().getPrix();
            if (ci.getVariant() != null && ci.getVariant().getPrixDelta() != null) prix = prix.add(ci.getVariant().getPrixDelta());
            sousTotal = sousTotal.add(prix.multiply(BigDecimal.valueOf(ci.getQuantite())));
            // Décrémente stock
            Product p = ci.getProduct();
            p.setStock(p.getStock() - ci.getQuantite());
            productRepository.save(p);
        }
        BigDecimal frais = BigDecimal.valueOf(5);
        BigDecimal total = sousTotal.add(frais);
        // Coupon
        if (cart.getCoupon() != null) {
            Coupon cp = cart.getCoupon();
            if (cp.getType().name().equals("PERCENT")) {
                total = total.subtract(total.multiply(cp.getValeur()).divide(BigDecimal.valueOf(100)));
            } else total = total.subtract(cp.getValeur());
            cp.setUsagesActuels(cp.getUsagesActuels() + 1);
            // couponRepository save handled via cascade? save manually if needed
        }
        order.setSousTotal(sousTotal);
        order.setFraisLivraison(frais);
        order.setTotalTTC(total.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : total);
        order = orderRepository.save(order);

        for (CartItem ci : cart.getLignes()) {
            BigDecimal prix = ci.getProduct().getPrixPromo() != null ? ci.getProduct().getPrixPromo() : ci.getProduct().getPrix();
            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(ci.getProduct())
                    .variant(ci.getVariant())
                    .quantite(ci.getQuantite())
                    .prixUnitaire(prix)
                    .build();
            order.getLignes().add(oi);
        }
        order = orderRepository.save(order);

        // Vider panier
        cartItemRepository.deleteAll(cart.getLignes());
        cart.getLignes().clear();
        cart.setCoupon(null);
        cartRepository.save(cart);

        return toDto(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long id) {
        Order o = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toDto(o);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        User u = currentUser();
        return orderRepository.findByCustomerId(u.getId()).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByDateCommandeDesc(pageable).map(this::toDto);
    }

    // PUT /api/orders/{id}/status - SELLER/ADMIN p.5
    public OrderResponse updateStatus(Long id, OrderStatus newStatus) {
        Order o = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        // Flux simulé p.3 : PENDING -> PAID -> PROCESSING -> SHIPPED -> DELIVERED
        o.setStatut(newStatus);
        return toDto(orderRepository.save(o));
    }

    // PUT /api/orders/{id}/cancel - CUSTOMER si PENDING ou PAID p.3
    public OrderResponse cancel(Long id) {
        Order o = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        User u = currentUser();
        if (!o.getCustomer().getId().equals(u.getId()) && !u.getRole().name().equals("ADMIN"))
            throw new IllegalArgumentException("Not owner");
        if (o.getStatut() != OrderStatus.PENDING && o.getStatut() != OrderStatus.PAID)
            throw new IllegalArgumentException("Annulation seulement si PENDING ou PAID, actuel: " + o.getStatut());
        o.setStatut(OrderStatus.CANCELLED);
        // Remboursement simulé: restock
        for (OrderItem oi : o.getLignes()) {
            Product p = oi.getProduct();
            p.setStock(p.getStock() + oi.getQuantite());
            productRepository.save(p);
        }
        return toDto(orderRepository.save(o));
    }

    private OrderResponse toDto(Order o) {
        return OrderResponse.builder()
                .id(o.getId())
                .numeroCommande(o.getNumeroCommande())
                .statut(o.getStatut())
                .paiement(o.getPaiement())
                .adresseLivraison(o.getAdresseLivraison())
                .sousTotal(o.getSousTotal())
                .fraisLivraison(o.getFraisLivraison())
                .totalTTC(o.getTotalTTC())
                .dateCommande(o.getDateCommande())
                .lignes(o.getLignes().stream().map(oi -> OrderItemResponse.builder()
                        .id(oi.getId())
                        .productId(oi.getProduct().getId())
                        .productNom(oi.getProduct().getNom())
                        .variantId(oi.getVariant() != null ? oi.getVariant().getId() : null)
                        .quantite(oi.getQuantite())
                        .prixUnitaire(oi.getPrixUnitaire())
                        .build()).toList())
                .build();
    }
}
