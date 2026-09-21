package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.CartDto;
import org.example.dto.CartItemDto;
import org.example.entity.*;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByCustomerId(user.getId()).orElseGet(() -> cartRepository.save(Cart.builder().customer(user).build()));
    }

    @Transactional(readOnly = true)
    public CartDto getCart() {
        User u = currentUser();
        Cart c = getOrCreateCart(u);
        return toDto(c);
    }

    public CartDto addItem(Long productId, Long variantId, Integer quantite) {
        User u = currentUser();
        Cart c = getOrCreateCart(u);
        Product p = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        ProductVariant v = variantId != null ? variantRepository.findById(variantId).orElse(null) : null;

        int stockDispo = p.getStock() + (v != null ? v.getStockSupplementaire() : 0);
        if (stockDispo < quantite) throw new IllegalArgumentException("Stock insuffisant: " + stockDispo);

        var existing = cartItemRepository.findByCartIdAndProductIdAndVariantId(c.getId(), productId, variantId).orElse(null);
        if (existing != null) {
            int newQ = existing.getQuantite() + quantite;
            if (stockDispo < newQ) throw new IllegalArgumentException("Stock insuffisant");
            existing.setQuantite(newQ);
            cartItemRepository.save(existing);
        } else {
            CartItem ci = CartItem.builder().cart(c).product(p).variant(v).quantite(quantite).build();
            cartItemRepository.save(ci);
            c.getLignes().add(ci);
        }
        return toDto(c);
    }

    public CartDto updateQuantity(Long itemId, Integer quantite) {
        CartItem ci = cartItemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        int stock = ci.getProduct().getStock() + (ci.getVariant() != null ? ci.getVariant().getStockSupplementaire() : 0);
        if (stock < quantite) throw new IllegalArgumentException("Stock insuffisant");
        ci.setQuantite(quantite);
        cartItemRepository.save(ci);
        return toDto(ci.getCart());
    }

    public CartDto removeItem(Long itemId) {
        CartItem ci = cartItemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        Cart c = ci.getCart();
        cartItemRepository.delete(ci);
        c.getLignes().remove(ci);
        return toDto(c);
    }

    public CartDto applyCoupon(String code) {
        Coupon cp = couponRepository.findByCode(code).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        if (!cp.getActif() || cp.getDateExpiration() != null && cp.getDateExpiration().isBefore(java.time.LocalDate.now()))
            throw new IllegalArgumentException("Coupon expiré/inactif");
        if (cp.getUsagesMax() != null && cp.getUsagesActuels() >= cp.getUsagesMax())
            throw new IllegalArgumentException("Coupon épuisé");
        User u = currentUser();
        Cart c = getOrCreateCart(u);
        c.setCoupon(cp);
        cartRepository.save(c);
        return toDto(c);
    }

    public CartDto removeCoupon() {
        User u = currentUser();
        Cart c = getOrCreateCart(u);
        c.setCoupon(null);
        cartRepository.save(c);
        return toDto(c);
    }

    private CartDto toDto(Cart c) {
        List<CartItemDto> lignes = c.getLignes().stream().map(ci -> CartItemDto.builder()
                .id(ci.getId())
                .productId(ci.getProduct().getId())
                .productNom(ci.getProduct().getNom())
                .variantId(ci.getVariant() != null ? ci.getVariant().getId() : null)
                .quantite(ci.getQuantite())
                .prixUnitaire(ci.getProduct().getPrixPromo() != null ? ci.getProduct().getPrixPromo() : ci.getProduct().getPrix())
                .build()).toList();
        BigDecimal sousTotal = lignes.stream()
                .map(l -> l.getPrixUnitaire().multiply(BigDecimal.valueOf(l.getQuantite()))).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal frais = BigDecimal.valueOf(5); // fixe pour demo
        BigDecimal total = sousTotal.add(frais);
        if (c.getCoupon() != null) {
            if (c.getCoupon().getType().name().equals("PERCENT")) {
                BigDecimal remise = total.multiply(c.getCoupon().getValeur()).divide(BigDecimal.valueOf(100));
                total = total.subtract(remise);
            } else {
                total = total.subtract(c.getCoupon().getValeur());
            }
            if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;
        }
        return CartDto.builder().id(c.getId()).lignes(lignes).sousTotal(sousTotal).fraisLivraison(frais).totalTTC(total)
                .couponCode(c.getCoupon() != null ? c.getCoupon().getCode() : null).build();
    }
}
