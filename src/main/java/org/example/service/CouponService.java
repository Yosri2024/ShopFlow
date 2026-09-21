package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.CouponRequest;
import org.example.entity.Coupon;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponService {

    private final CouponRepository couponRepository;

    public Coupon create(CouponRequest req) {
        if (couponRepository.existsByCode(req.getCode())) throw new IllegalArgumentException("Code exists");
        Coupon c = Coupon.builder()
                .code(req.getCode()).type(req.getType()).valeur(req.getValeur())
                .dateExpiration(req.getDateExpiration()).usagesMax(req.getUsagesMax())
                .actif(req.getActif() != null ? req.getActif() : true).usagesActuels(0).build();
        return couponRepository.save(c);
    }

    public Coupon update(Long id, CouponRequest req) {
        Coupon c = couponRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        c.setCode(req.getCode()); c.setType(req.getType()); c.setValeur(req.getValeur());
        c.setDateExpiration(req.getDateExpiration()); c.setUsagesMax(req.getUsagesMax()); c.setActif(req.getActif());
        return couponRepository.save(c);
    }

    public void delete(Long id) { couponRepository.deleteById(id); }

    @Transactional(readOnly = true)
    public Coupon validate(String code) {
        Coupon c = couponRepository.findByCode(code).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        if (!c.getActif() || c.getDateExpiration() != null && c.getDateExpiration().isBefore(LocalDate.now()))
            throw new IllegalArgumentException("Coupon invalide/expiré");
        if (c.getUsagesMax() != null && c.getUsagesActuels() >= c.getUsagesMax())
            throw new IllegalArgumentException("Coupon épuisé");
        return c;
    }
}
