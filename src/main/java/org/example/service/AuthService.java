package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.JwtResponse;
import org.example.dto.RegisterRequest;
import org.example.entity.User;
import org.example.enums.Role;
import org.example.repository.UserRepository;
import org.example.security.CustomUserDetailsService;
import org.example.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public JwtResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        Role role = Role.CUSTOMER;
        if (req.getRole() != null && (req.getRole().equalsIgnoreCase("SELLER") || req.getRole().equalsIgnoreCase("ADMIN"))) {
            role = Role.valueOf(req.getRole().toUpperCase());
        }
        User u = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .prenom(req.getPrenom())
                .nom(req.getNom())
                .role(role)
                .actif(true)
                .build();
        userRepository.save(u);

        // Seller profile if needed
        if (role == Role.SELLER && req.getNomBoutique() != null) {
            // will be handled later via SellerProfile creation
        }

        var ud = userDetailsService.loadUserByUsername(u.getEmail());
        String access = jwtService.generateAccessToken(ud);
        String refresh = jwtService.generateRefreshToken(ud);
        return JwtResponse.builder().accessToken(access).refreshToken(refresh).email(u.getEmail()).role(role.name()).expiresIn(3600L).build();
    }

    public JwtResponse login(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        var ud = userDetailsService.loadUserByUsername(email);
        User u = userRepository.findByEmail(email).orElseThrow();
        String access = jwtService.generateAccessToken(ud);
        String refresh = jwtService.generateRefreshToken(ud);
        return JwtResponse.builder().accessToken(access).refreshToken(refresh).email(email).role(u.getRole().name()).expiresIn(3600L).build();
    }

    public JwtResponse refresh(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        var ud = userDetailsService.loadUserByUsername(email);
        if (!jwtService.isValid(refreshToken, ud)) throw new IllegalArgumentException("Invalid refresh token");
        String newAccess = jwtService.generateAccessToken(ud);
        User u = userRepository.findByEmail(email).orElseThrow();
        return JwtResponse.builder().accessToken(newAccess).refreshToken(refreshToken).email(email).role(u.getRole().name()).expiresIn(3600L).build();
    }
}
