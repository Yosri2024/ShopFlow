package org.example.dto;

import lombok.*;
import org.example.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderResponse {
    private Long id;
    private String numeroCommande;
    private OrderStatus statut;
    private String adresseLivraison;
    private BigDecimal sousTotal;
    private BigDecimal fraisLivraison;
    private BigDecimal totalTTC;
    private LocalDateTime dateCommande;
    private List<OrderItemResponse> lignes;
}
