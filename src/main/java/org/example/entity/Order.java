package org.example.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.enums.OrderStatus;
import org.example.enums.PaymentMethod;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus statut = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentMethod paiement = PaymentMethod.ESPECE;

    @Column(unique = true, nullable = false)
    private String numeroCommande; // ex: ORD-2024-XXXXX

    private String adresseLivraison;

    @Column(precision = 10, scale = 2)
    private BigDecimal sousTotal;

    @Column(precision = 10, scale = 2)
    private BigDecimal fraisLivraison;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalTTC;

    @CreationTimestamp
    private LocalDateTime dateCommande;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> lignes = new ArrayList<>();

    @PrePersist
    public void generateNumero() {
        if (numeroCommande == null) {
            numeroCommande = "ORD-" + java.time.Year.now().getValue() + "-" + (int)(Math.random()*90000+10000);
        }
    }
}
