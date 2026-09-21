package org.example.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CartItemDto {
    private Long id;
    private Long productId;
    private String productNom;
    private Long variantId;
    private Integer quantite;
    private java.math.BigDecimal prixUnitaire;
}
