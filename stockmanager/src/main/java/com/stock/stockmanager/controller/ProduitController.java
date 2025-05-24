package com.stock.stockmanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.repository.ProduitRepository;

@RestController
@RequestMapping("/produits")
public class ProduitController {

    private final ProduitRepository produitRepository;


    public ProduitController(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

   
    @GetMapping("/all")
    public List<Produit> getAll() {
    List<Produit> produits = produitRepository.findAll();
    System.out.println("Returned produits: " + produits.size());
    return produits;
    }


    @GetMapping("/byCategorie/{id}")
    public List<Produit> getByCategorie(@PathVariable("id") Integer id) {
    System.out.println("Fetching produits for categorie ID: " + id);
    List<Produit> produits = produitRepository.findByCategorieId(id);
    System.out.println("Found " + produits.size() + " produits");
    return produits;
    }

}
