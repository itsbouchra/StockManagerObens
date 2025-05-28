package com.stock.stockmanager.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.ProduitDTO;
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
public List<ProduitDTO> getAll() {
    List<Produit> produits = produitRepository.findAll();
    return produits.stream().map(produit -> {
        ProduitDTO dto = new ProduitDTO();
        dto.setId(produit.getId());
        dto.setNom(produit.getNom());
        dto.setDescription(produit.getDescription());
        dto.setPrix(produit.getPrix());
        dto.setPhoto(produit.getPhoto());
        dto.setUnit(produit.getUnit());
        dto.setStockMin(produit.getStockMin());
        dto.setNomCategorie(produit.getCategorie() != null ? produit.getCategorie().getNom() : null);
        return dto;
    }).collect(Collectors.toList());
}

@GetMapping("/byCategorie/{id}")
public List<ProduitDTO> getByCategorie(@PathVariable("id") Integer id) {
    List<Produit> produits = produitRepository.findByCategorieId(id);
    return produits.stream().map(produit -> {
        ProduitDTO dto = new ProduitDTO();
        dto.setId(produit.getId());
        dto.setNom(produit.getNom());
        dto.setDescription(produit.getDescription());
        dto.setPrix(produit.getPrix());
        dto.setPhoto(produit.getPhoto());
        dto.setUnit(produit.getUnit());
        dto.setStockMin(produit.getStockMin());
        dto.setNomCategorie(produit.getCategorie() != null ? produit.getCategorie().getNom() : null);
        return dto;
    }).collect(Collectors.toList());
}


//added 
@GetMapping("/{id}")
public ResponseEntity<ProduitDTO> getProduitById(@PathVariable Integer id) {
    Optional<Produit> produitOpt = produitRepository.findById(id);

    if (produitOpt.isPresent()) {
        Produit produit = produitOpt.get();

        ProduitDTO dto = new ProduitDTO();
        dto.setId(produit.getId());
        dto.setNom(produit.getNom());
        dto.setDescription(produit.getDescription());
        dto.setPrix(produit.getPrix());
        dto.setPhoto(produit.getPhoto());
        dto.setUnit(produit.getUnit());
        dto.setStockMin(produit.getStockMin());
        dto.setNomCategorie(produit.getCategorie() != null ? produit.getCategorie().getNom() : null);

        return ResponseEntity.ok(dto);
    }

    return ResponseEntity.notFound().build();
}




}
