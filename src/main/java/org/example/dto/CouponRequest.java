package org.example.dto;

import lombok.*;
import org.example.enums.CouponType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CouponRequest {
    private String code;
    private CouponType type;
    private BigDecimal valeur;
    private LocalDate dateExpiration;
    private Integer usagesMax;
    private Boolean actif;
}
