package org.example.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterRequest {
    @Email @NotBlank
    private String email;
    @NotBlank @Size(min = 8, message = "Mot de passe fort requis (8+ chars)")
    private String password;
    @NotBlank
    private String prenom;
    @NotBlank
    private String nom;
    private String role; // CUSTOMER or SELLER, default CUSTOMER
    // Seller info si role SELLER
    private String nomBoutique;
}
