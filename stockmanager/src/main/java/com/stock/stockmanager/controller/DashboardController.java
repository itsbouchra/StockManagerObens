package com.stock.stockmanager.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger LOGGER = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private ActivityService activityService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        DashboardSummaryDTO dashboardSummaryDTO = new DashboardSummaryDTO();
        dashboardSummaryDTO.setTotalProducts(produitRepository.countAllProduits());
        dashboardSummaryDTO.setOutOfStock(produitRepository.findOutOfStockProductIds().size());
        dashboardSummaryDTO.setLowStock(produitRepository.findLowStockProductIds().size());

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

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<Produit>> getOutOfStockProducts() {
        try {
            List<Integer> outOfStockIds = produitRepository.findOutOfStockProductIds();
            List<Produit> outOfStockProducts = produitRepository.findAllById(outOfStockIds);
            return ResponseEntity.ok(outOfStockProducts);
        } catch (Exception e) {
            LOGGER.error("Error fetching out of stock products", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Produit>> getLowStockProducts() {
        try {
            List<Integer> lowStockIds = produitRepository.findLowStockProductIds();
            List<Produit> lowStockProducts = produitRepository.findAllById(lowStockIds);
            return ResponseEntity.ok(lowStockProducts);
        } catch (Exception e) {
            LOGGER.error("Error fetching low stock products", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
