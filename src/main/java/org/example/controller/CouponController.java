package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.CouponRequest;
import org.example.entity.Coupon;
import org.example.service.CouponService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // POST/PUT/DELETE /api/coupons - ADMIN p.5
    @PostMapping
    public ResponseEntity<Coupon> create(@RequestBody CouponRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(couponService.create(req));
    }

    @PutMapping("/{id}")
    public Coupon update(@PathVariable Long id, @RequestBody CouponRequest req) {
        return couponService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { couponService.delete(id); }

    // GET /api/coupons/validate/{code} - p.5
    @GetMapping("/validate/{code}")
    public Coupon validate(@PathVariable String code) { return couponService.validate(code); }
}
