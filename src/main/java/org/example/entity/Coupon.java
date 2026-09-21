package org.example.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.enums.CouponType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Coupon {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    private CouponType type;

    @Column(precision = 10, scale = 2)
    private BigDecimal valeur;

    private LocalDate dateExpiration;

    private Integer usagesMax;

    @Builder.Default
    private Integer usagesActuels = 0;

    @Builder.Default
    private Boolean actif = true;
}
