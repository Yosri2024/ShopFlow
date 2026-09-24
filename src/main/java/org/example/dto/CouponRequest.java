package org.example.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import org.example.enums.CouponType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CouponRequest {
    @NotBlank
    private String code;
    @NotNull
    private CouponType type;
    @NotNull @Positive
    private BigDecimal valeur;
    @NotNull @Future
    private LocalDate dateExpiration;
    @NotNull @Min(1)
    private Integer usagesMax;
    private Boolean actif;
}
