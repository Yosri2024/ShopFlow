package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.ReviewRequest;
import org.example.entity.Review;
import org.example.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // POST /api/reviews - p.5
    @PostMapping
    public ResponseEntity<Review> create(@RequestBody ReviewRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(req.getProductId(), req.getNote(), req.getCommentaire()));
    }

    // GET /api/reviews/product/{productId} - p.5
    @GetMapping("/product/{productId}")
    public List<Review> byProduct(@PathVariable Long productId) {
        return reviewService.getByProduct(productId);
    }

    // PUT /api/reviews/{id}/approve - ADMIN p.5
    @PutMapping("/{id}/approve")
    public Review approve(@PathVariable Long id) {
        return reviewService.approve(id);
    }
}
