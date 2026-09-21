package org.example.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateOrderRequest {
    private Long addressId; // parmi adresses sauvegardées p.3
    private String adresseLivraison; // ou texte libre
}
