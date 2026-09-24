package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.CreateOrderRequest;
import org.example.dto.OrderResponse;
import org.example.enums.OrderStatus;
import org.example.enums.PaymentMethod;
import org.example.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders - passer une commande depuis le panier - p.5
    @PostMapping
    public ResponseEntity<OrderResponse> create(@RequestBody(required = false) @Valid CreateOrderRequest req) {
        Long addressId = req != null ? req.getAddressId() : null;
        String adresse = req != null && req.getAdresseLivraison() != null ? req.getAdresseLivraison() : "Adresse par défaut";
        PaymentMethod paiement = req != null && req.getPaiement() != null ? req.getPaiement() : PaymentMethod.ESPECE;
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(addressId, adresse, paiement));
    }

    // GET /api/orders/{id} - détail - p.5
    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    // GET /api/orders/my - commandes du client connecté - p.5
    @GetMapping("/my")
    public List<OrderResponse> myOrders() {
        return orderService.getMyOrders();
    }

    // GET /api/orders - toutes les commandes (ADMIN) - p.5
    @GetMapping
    public Page<OrderResponse> all(Pageable pageable) {
        return orderService.getAllOrders(pageable);
    }

    // PUT /api/orders/{id}/status - mettre à jour le statut (SELLER/ADMIN) - p.5
    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderService.updateStatus(id, OrderStatus.valueOf(body.get("statut")));
    }

    // PUT /api/orders/{id}/cancel - annuler (CUSTOMER si éligible) - p.5
    @PutMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable Long id) {
        return orderService.cancel(id);
    }
}
