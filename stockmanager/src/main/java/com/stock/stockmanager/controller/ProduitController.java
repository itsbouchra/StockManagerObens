package com.stock.stockmanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.repository.ProduitRepository;

@RestController
@RequestMapping("/products")
public class ProduitController {

    private final ProduitRepository produitRepository;

    public ProduitController(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    // Add test product
    @PostMapping("/add")
    public String addProduit() {
        Produit p = new Produit("Laptop", 10, 1200.50);
        produitRepository.save(p);
        return "Product added!";
    }

    // Get all products
    @GetMapping("/all")
    public List<Produit> getAll() {
        return produitRepository.findAll();
    }
}
