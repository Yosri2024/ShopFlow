package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.repository.OrderRepository;
import org.example.repository.ProductRepository;
import org.example.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Map<String, Object> adminStats() {
        Map<String, Object> m = new HashMap<>();
        m.put("totalOrders", orderRepository.count());
        m.put("totalProducts", productRepository.count());
        m.put("totalUsers", userRepository.count());
        m.put("recentOrders", orderRepository.findRecentOrders(org.springframework.data.domain.PageRequest.of(0, 5)));
        // Chiffre d'affaires global
        BigDecimal ca = orderRepository.findAll().stream()
                .map(o -> o.getTotalTTC() != null ? o.getTotalTTC() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        m.put("chiffreAffaires", ca);
        return m;
    }

    public Map<String, Object> sellerStats(Long sellerId) {
        Map<String, Object> m = new HashMap<>();
        m.put("myProducts", productRepository.findBySellerId(sellerId, org.springframework.data.domain.PageRequest.of(0, 100)).getTotalElements());
        m.put("pendingOrders", orderRepository.findByCustomerId(sellerId).size()); // simplifié
        m.put("lowStockProducts", productRepository.findAll().stream().filter(p -> p.getStock() < 5).toList());
        return m;
    }
}
