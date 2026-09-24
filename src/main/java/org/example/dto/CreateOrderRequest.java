package org.example.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.example.enums.PaymentMethod;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateOrderRequest {
    private Long addressId; // parmi adresses sauvegardées p.3
    private String adresseLivraison; // ou texte libre
    @NotNull
    private PaymentMethod paiement = PaymentMethod.ESPECE;
}
