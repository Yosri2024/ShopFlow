package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CategoryDto {
    private Long id;

    @NotBlank
    private String nom;

    private String description;

    private Long parentId;

    @Builder.Default
    private List<CategoryDto> children = new ArrayList<>();
}
