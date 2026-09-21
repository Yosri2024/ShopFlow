package org.example.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productNom;
    private Long variantId;
    private Integer quantite;
    private BigDecimal prixUnitaire;
}
