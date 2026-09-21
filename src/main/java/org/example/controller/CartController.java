package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.AddCartItemRequest;
import org.example.dto.CartDto;
import org.example.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET /api/cart - panier du client connecté - p.5
    @GetMapping
    public CartDto getCart() {
        return cartService.getCart();
    }

    // POST /api/cart/items - ajouter un article - p.5
    @PostMapping("/items")
    public CartDto addItem(@RequestBody AddCartItemRequest req) {
        return cartService.addItem(req.getProductId(), req.getVariantId(), req.getQuantite());
    }

    // PUT /api/cart/items/{itemId} - modifier quantité - p.5
    @PutMapping("/items/{itemId}")
    public CartDto updateQuantity(@PathVariable Long itemId, @RequestBody Map<String, Integer> body) {
        return cartService.updateQuantity(itemId, body.get("quantite"));
    }

    // DELETE /api/cart/items/{itemId} - retirer un article - p.5
    @DeleteMapping("/items/{itemId}")
    public CartDto removeItem(@PathVariable Long itemId) {
        return cartService.removeItem(itemId);
    }

    // POST /api/cart/coupon - appliquer un code promo - p.5
    @PostMapping("/coupon")
    public CartDto applyCoupon(@RequestBody Map<String, String> body) {
        return cartService.applyCoupon(body.get("code"));
    }

    // DELETE /api/cart/coupon - retirer le code promo - p.5
    @DeleteMapping("/coupon")
    public CartDto removeCoupon() {
        return cartService.removeCoupon();
    }
}
