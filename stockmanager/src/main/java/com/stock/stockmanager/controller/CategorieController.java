package com.stock.stockmanager.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.CategorieDTO;
import com.stock.stockmanager.dto.ProduitDTO;
import com.stock.stockmanager.model.Categorie;
import com.stock.stockmanager.repository.CategorieRepository;

@RestController
@RequestMapping("/categories")
public class CategorieController {

    @Autowired
    private CategorieRepository categorieRepository;

    // ✅ GET : Retourne toutes les catégories avec leurs produits
    @GetMapping("/all")
    public List<CategorieDTO> getCategories() {
        List<Categorie> categories = categorieRepository.findAll();

        return categories.stream().map(categorie -> {
            CategorieDTO dto = new CategorieDTO();
            dto.setId_categorie(categorie.getIdCategorie());
            dto.setNom(categorie.getNom());
            dto.setDescription(categorie.getDescription());

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

    // ✅ POST : Ajouter une nouvelle catégorie
    @PostMapping
    public ResponseEntity<?> createCategorie(@RequestBody Categorie categorie) {
        try {
            Categorie saved = categorieRepository.save(categorie);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erreur lors de l'enregistrement.");
        }
    }

    // ✅ DELETE : Supprimer une catégorie par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategorie(@PathVariable Integer id) {
        if (!categorieRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Catégorie non trouvée.");
        }

        try {
            categorieRepository.deleteById(id);
            return ResponseEntity.ok("Catégorie supprimée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erreur lors de la suppression.");
        }
    }
}
