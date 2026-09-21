package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Product;
import org.example.entity.Review;
import org.example.entity.User;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.OrderRepository;
import org.example.repository.ProductRepository;
import org.example.repository.ReviewRepository;
import org.example.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // POST /api/reviews - seulement si achat vérifié p.3
    public Review createReview(Long productId, Integer note, String commentaire) {
        User u = currentUser();
        Product p = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        boolean hasPurchased = orderRepository.findByCustomerId(u.getId()).stream()
                .anyMatch(o -> o.getLignes().stream().anyMatch(oi -> oi.getProduct().getId().equals(productId)));
        if (!hasPurchased) throw new IllegalArgumentException("Vous devez acheter le produit avant de laisser un avis");
        Review r = Review.builder().customer(u).product(p).note(note).commentaire(commentaire).approuve(false).build();
        return reviewRepository.save(r);
    }

    @Transactional(readOnly = true)
    public List<Review> getByProduct(Long productId) {
        return reviewRepository.findByProductIdAndApprouveTrue(productId);
    }

    public Review approve(Long id) {
        Review r = reviewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        r.setApprouve(true);
        return reviewRepository.save(r);
    }
}
