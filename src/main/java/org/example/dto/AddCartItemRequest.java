package org.example.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AddCartItemRequest {
    @NotNull
    private Long productId;
    private Long variantId;
    @Min(1)
    private Integer quantite;
}
