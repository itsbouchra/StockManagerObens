package com.stock.stockmanager.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.repository.ProduitRepository;
import com.stock.stockmanager.service.ActivityService;
import com.stock.stockmanager.dto.DashboardSummaryDTO;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private ActivityService activityService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        DashboardSummaryDTO dashboardSummaryDTO = new DashboardSummaryDTO();
        dashboardSummaryDTO.setTotalProducts(produitRepository.countAllProduits());
        dashboardSummaryDTO.setOutOfStock(produitRepository.countOutOfStock());
        dashboardSummaryDTO.setLowStock(produitRepository.countLowStock());

        dashboardSummaryDTO.setRecentActivityCount(activityService.getAllRecentActivities().size());
        dashboardSummaryDTO.setActivities(activityService.getTop4RecentActivities());

        return ResponseEntity.ok(dashboardSummaryDTO);
    }

    @GetMapping("/distribution")
    public Map<String, Integer> getDistribution() {
        List<Produit> produits = produitRepository.findAll();
        Map<String, Integer> distribution = new HashMap<>();

        for (Produit produit : produits) {
            String categoryName = produit.getCategorie() != null ? produit.getCategorie().getNom() : "Inconnu";
            distribution.put(categoryName, distribution.getOrDefault(categoryName, 0) + 1);
        }

        return distribution;
    }
}
