package com.stock.stockmanager.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.AchatDTO;
import com.stock.stockmanager.dto.LigneAchatDTO;
import com.stock.stockmanager.model.Achat;
import com.stock.stockmanager.model.LigneAchat;
import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.model.User;
import com.stock.stockmanager.repository.AchatRepository;
import com.stock.stockmanager.repository.ProduitRepository;
import com.stock.stockmanager.repository.UserRepository;

@RestController
@RequestMapping("/api/achats")
public class AchatController {
    @Autowired
    private AchatRepository achatRepository;

    @Autowired
    private UserRepository userRepository; // Ajoute ce repository

    @Autowired
    private ProduitRepository produitRepository;

    @GetMapping
    public List<AchatDTO> getAllAchats() {
        return achatRepository.findAllWithUser().stream()
            .map(AchatDTO::new)
            .collect(Collectors.toList());
    }


    @GetMapping("/test")
    public String testApi() {
        return "API is working";
    }

    @PostMapping
    public ResponseEntity<?> addAchat(@RequestBody AchatDTO achatDTO) {
        Achat achat = new Achat();
        achat.setDateAchat(LocalDate.parse(achatDTO.getDateAchat()));
        achat.setMontantTotal(achatDTO.getMontantTotal());
        achat.setStatut(achatDTO.getStatut());

        // Charger le fournisseur (user) par son id
        User fournisseur = userRepository.findById(achatDTO.getIdFournisseur())
            .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
        achat.setUser(fournisseur);

        // Gérer les lignes produits
        List<LigneAchat> lignes = new ArrayList<>();
        if (achatDTO.getLignes() != null) {
            for (LigneAchatDTO l : achatDTO.getLignes()) {
                LigneAchat ligne = new LigneAchat();
                ligne.setAchat(achat);
                ligne.setQuantite(l.getQuantite());
                ligne.setPrix(l.getPrix());
                ligne.setTotal(l.getTotal());
                // Charger le produit
                if (l.getIdProduit() == null) {
                    throw new RuntimeException("idProduit est null pour une ligne d'achat");
                }
                Produit produit = produitRepository.findById(l.getIdProduit())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
                ligne.setProduit(produit);
                lignes.add(ligne);
            }
        }
        achat.setLignes(lignes);

        achatRepository.save(achat);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAchat(@PathVariable Integer id) {
        if (!achatRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        achatRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AchatDTO> getAchatById(@PathVariable Integer id) {
        return achatRepository.findById(id)
            .map(achat -> ResponseEntity.ok(new AchatDTO(achat)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAchat(@PathVariable Integer id, @RequestBody AchatDTO achatDTO) {
        return achatRepository.findById(id).map(achat -> {
            achat.setDateAchat(LocalDate.parse(achatDTO.getDateAchat()));
            achat.setMontantTotal(achatDTO.getMontantTotal());
            achat.setStatut(achatDTO.getStatut());

            // Mettre à jour le fournisseur
            User fournisseur = userRepository.findById(achatDTO.getIdFournisseur())
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
            achat.setUser(fournisseur);

            // Supprimer les anciennes lignes (en modifiant la liste existante)
            achat.getLignes().clear();
            if (achatDTO.getLignes() != null) {
                for (LigneAchatDTO l : achatDTO.getLignes()) {
                    LigneAchat ligne = new LigneAchat();
                    ligne.setAchat(achat);
                    ligne.setQuantite(l.getQuantite());
                    ligne.setPrix(l.getPrix());
                    ligne.setTotal(l.getTotal());
                    if (l.getIdProduit() == null) {
                        throw new RuntimeException("idProduit est null pour une ligne d'achat");
                    }
                    Produit produit = produitRepository.findById(l.getIdProduit())
                        .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
                    ligne.setProduit(produit);
                    achat.getLignes().add(ligne); // <-- ajoute à la liste existante
                }
            }

            achatRepository.save(achat);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
