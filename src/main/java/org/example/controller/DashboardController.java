package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.service.DashboardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // GET /api/dashboard/admin - p.5
    @GetMapping("/admin")
    public Map<String, Object> admin() {
        return dashboardService.adminStats();
    }

    // GET /api/dashboard/seller - p.5
    @GetMapping("/seller")
    public Map<String, Object> seller() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // sellerId récupéré via email -> simplifié: utilise hash
        return dashboardService.sellerStats((long) email.hashCode());
    }
}
