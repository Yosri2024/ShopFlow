package org.example.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewRequest {
    @NotNull
    private Long productId;
    @Min(1) @Max(5)
    private Integer note;
    private String commentaire;
}
