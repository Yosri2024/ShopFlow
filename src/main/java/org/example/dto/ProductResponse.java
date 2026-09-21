package org.example.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductResponse {
    private Long id;
    private String nom;
    private String description;
    private BigDecimal prix;
    private BigDecimal prixPromo;
    private Integer stock;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private Long sellerId;
    private String sellerNom;
    private Set<CategoryDto> categories;
    private List<String> images;
    private List<ProductVariantDto> variants;
    private Double noteMoyenne;
    private Integer pourcentageRemise;

    public Integer getPourcentageRemise() {
        if (prix != null && prixPromo != null && prix.compareTo(BigDecimal.ZERO) > 0) {
            return prix.subtract(prixPromo).multiply(BigDecimal.valueOf(100)).divide(prix, 0, java.math.RoundingMode.HALF_UP).intValue();
        }
        return null;
    }
}
