package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductRequest {

    @NotBlank
    private String nom;

    private String description;

    @NotNull
    private BigDecimal prix;

    private BigDecimal prixPromo;

    @NotNull
    private Integer stock;

    private Set<Long> categoryIds;

    private List<String> images;
}
