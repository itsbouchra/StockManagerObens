package com.stock.stockmanager.controller;

import com.stock.stockmanager.repository.ProduitRepository;
import com.stock.stockmanager.model.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProduitRepository produitRepository;

    @GetMapping("/summary")
    public Map<String, Integer> getSummary() {
        Map<String, Integer> summary = new HashMap<>();
        summary.put("totalProducts", produitRepository.countAllProduits());
        summary.put("outOfStock", produitRepository.countOutOfStock());
        summary.put("lowStock", produitRepository.countLowStock());
        return summary;
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

    @GetMapping("/activity")
    public List<String> getRecentActivities() {
        return List.of("Real data will go here soon");
    }
}
