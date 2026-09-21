package org.example.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductVariant {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Ex: Taille, Couleur
    private String attribut;
    // Ex: M, Rouge
    private String valeur;

    @Builder.Default
    private Integer stockSupplementaire = 0;

    @Builder.Default
    private BigDecimal prixDelta = BigDecimal.ZERO;
}
