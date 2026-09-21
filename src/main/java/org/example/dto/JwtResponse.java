package org.example.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String role;
    private Long expiresIn;
}
