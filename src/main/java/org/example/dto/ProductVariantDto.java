package org.example.dto;

import lombok.*;

import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductVariantDto {
    private Long id;
    private String attribut;
    private String valeur;
    private Integer stockSupplementaire;
    private BigDecimal prixDelta;
}
