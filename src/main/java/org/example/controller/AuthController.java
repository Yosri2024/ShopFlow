package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.AuthRequest;
import org.example.dto.JwtResponse;
import org.example.dto.RefreshRequest;
import org.example.dto.RegisterRequest;
import org.example.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register - inscription client ou vendeur - p.5
    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    // POST /api/auth/login - retourne access_token + refresh_token - p.5
    @PostMapping("/login")
    public JwtResponse login(@Valid @RequestBody AuthRequest req) {
        return authService.login(req.getEmail(), req.getPassword());
    }

    // POST /api/auth/refresh - renouvellement du token - p.5
    @PostMapping("/refresh")
    public JwtResponse refresh(@RequestBody RefreshRequest req) {
        return authService.refresh(req.getRefreshToken());
    }

    // POST /api/auth/logout - invalidation du refresh token - p.5
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }
}
