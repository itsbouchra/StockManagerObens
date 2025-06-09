package com.stock.stockmanager.controller;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.ProduitDTO;
import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.repository.CategorieRepository;
import com.stock.stockmanager.repository.ProduitRepository;

@RestController
@RequestMapping("/produits")
public class ProduitController {

    @Autowired
    private final ProduitRepository produitRepository;

    private final CategorieRepository categorieRepository;

    public ProduitController(ProduitRepository produitRepository, CategorieRepository categorieRepository) {
        this.produitRepository = produitRepository;
        this.categorieRepository = categorieRepository;
    }

    @GetMapping("/all")
    public List<ProduitDTO> getAll() {
        List<Produit> produits = produitRepository.findAll();
        return produits.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/byCategorie/{id}")
    public List<ProduitDTO> getByCategorie(@PathVariable("id") Integer id) {
        List<Produit> produits = produitRepository.findByCategorieId(id);
        return produits.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitDTO> getProduitById(@PathVariable Integer id) {
        Optional<Produit> produitOpt = produitRepository.findById(id);
        if (produitOpt.isPresent()) {
            return ResponseEntity.ok(convertToDTO(produitOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProduitDTO> updateProduit(@PathVariable Integer id, @RequestBody ProduitDTO produitDTO) {
        Optional<Produit> produitOpt = produitRepository.findById(id);
        if (!produitOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Produit produit = produitOpt.get();
        produit.setNom(produitDTO.getNom());
        produit.setDescription(produitDTO.getDescription());
        produit.setPrix(produitDTO.getPrix());
        produit.setPhoto(produitDTO.getPhoto());
        produit.setUnit(produitDTO.getUnit());
        produit.setStockMin(produitDTO.getStockMin());

        if (produitDTO.getCategorieId() != null) {
            categorieRepository.findById(produitDTO.getCategorieId())
                .ifPresent(produit::setCategorie);
        }

        produitRepository.save(produit);

        return ResponseEntity.ok(convertToDTO(produit));
    }

    private ProduitDTO convertToDTO(Produit produit) {
        ProduitDTO dto = new ProduitDTO();
        dto.setId(produit.getId());
        dto.setNom(produit.getNom());
        dto.setDescription(produit.getDescription());
        dto.setPrix(produit.getPrix());
        dto.setPhoto(produit.getPhoto());
        dto.setUnit(produit.getUnit());
        dto.setStockMin(produit.getStockMin());
        if (produit.getCategorie() != null) {
            dto.setNomCategorie(produit.getCategorie().getNom());
            dto.setCategorieId(produit.getCategorie().getIdCategorie());
        }
        return dto;
    }
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteProduit(@PathVariable Integer id) {
    if (!produitRepository.existsById(id)) {
       
        return ResponseEntity.notFound().build();
    }
    produitRepository.deleteById(id);
    return ResponseEntity.ok().build();
}


@PostMapping("/add")
public ResponseEntity<ProduitDTO> addProduit(@RequestBody ProduitDTO produitDTO) {
    Produit produit = new Produit();
    produit.setNom(produitDTO.getNom());
    produit.setDescription(produitDTO.getDescription());
    produit.setPrix(produitDTO.getPrix());
    produit.setPhoto(produitDTO.getPhoto());
    produit.setUnit(produitDTO.getUnit());
    produit.setStockMin(produitDTO.getStockMin());

    if (produitDTO.getCategorieId() != null) {
        categorieRepository.findById(produitDTO.getCategorieId())
            .ifPresent(produit::setCategorie);
    }

    Produit savedProduit = produitRepository.save(produit);

    return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedProduit));
} 


    
}
