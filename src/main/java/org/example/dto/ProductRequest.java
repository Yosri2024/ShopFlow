package org.example.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductRequest {

    @NotBlank @Size(max = 150)
    private String nom;

    @Size(max = 2000)
    private String description;

    @NotNull @Positive
    private BigDecimal prix;

    @Positive
    private BigDecimal prixPromo;

    @NotNull @Min(0)
    private Integer stock;

    private Set<Long> categoryIds;

    private List<String> images;
}
