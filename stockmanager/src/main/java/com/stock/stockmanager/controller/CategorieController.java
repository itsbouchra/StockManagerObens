package com.stock.stockmanager.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.CategorieDTO;
import com.stock.stockmanager.dto.ProduitDTO;
import com.stock.stockmanager.model.Categorie;
import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.repository.CategorieRepository;

@RestController
@RequestMapping("/categories")
public class CategorieController {

    @Autowired
    private CategorieRepository categorieRepository;

    @GetMapping("/all")
    public List<CategorieDTO> getCategories() {
        List<Categorie> categories = categorieRepository.findAll();
        
        // Mappe chaque Categorie en CategorieDTO
        return categories.stream().map(categorie -> {
            CategorieDTO dto = new CategorieDTO();
            dto.setId_categorie(categorie.getIdCategorie()); // ✅ corriger ici
            dto.setNom(categorie.getNom());
            dto.setDescription(categorie.getDescription());
            
            // Mappe aussi les produits s’ils existent
            if (categorie.getProduits() != null) {
                List<ProduitDTO> produitsDTO = categorie.getProduits().stream().map(produit -> {
                    ProduitDTO pDto = new ProduitDTO();
                    pDto.setId(produit.getId());
                    pDto.setNom(produit.getNom());
                    pDto.setPrix(produit.getPrix());
                    return pDto;
                }).collect(Collectors.toList());
                dto.setProduits(produitsDTO);
            }

            return dto;
        }).collect(Collectors.toList());
    }
}
