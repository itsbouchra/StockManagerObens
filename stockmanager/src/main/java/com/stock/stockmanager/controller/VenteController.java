package com.stock.stockmanager.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.LigneVenteDTO;
import com.stock.stockmanager.dto.VenteDTO;
import com.stock.stockmanager.model.LigneVente;
import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.model.User;
import com.stock.stockmanager.model.Vente;
import com.stock.stockmanager.repository.ProduitRepository;
import com.stock.stockmanager.repository.UserRepository;
import com.stock.stockmanager.repository.VenteRepository;

@RestController
@RequestMapping("/api/ventes")
@CrossOrigin(origins = "http://localhost:19006", allowCredentials = "true")

public class VenteController {

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @GetMapping
    public List<VenteDTO> getAllVentes() {
        return venteRepository.findAll().stream()
                .map(VenteDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
public ResponseEntity<?> addVente(@RequestBody VenteDTO venteDTO) {
    try {
        System.out.println("Début traitement vente...");
        Vente vente = new Vente();

        System.out.println("Date : " + venteDTO.getDateVente());
        vente.setDateVente(LocalDate.parse(venteDTO.getDateVente()));

        System.out.println("Montant total : " + venteDTO.getMontantTotal());
        vente.setMontantTotal(venteDTO.getMontantTotal());

        System.out.println("Statut : " + venteDTO.getStatut());
        vente.setStatut(venteDTO.getStatut());

        System.out.println("Client ID : " + venteDTO.getIdClient());
        User client = userRepository.findById(venteDTO.getIdClient())
            .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        vente.setClient(client);

        List<LigneVente> lignes = new ArrayList<>();
        if (venteDTO.getLignes() != null) {
            for (LigneVenteDTO l : venteDTO.getLignes()) {
                System.out.println("Produit ID : " + l.getIdProduit());
                if (l.getIdProduit() == null) {
                    throw new RuntimeException("idProduit manquant dans une ligne de vente");
                }

                Produit produit = produitRepository.findById(l.getIdProduit())
                        .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

                LigneVente ligne = new LigneVente();
                ligne.setVente(vente);
                ligne.setProduit(produit);
                ligne.setQuantite(l.getQuantite());
                ligne.setPrix(l.getPrix());
                ligne.setTotal(l.getTotal());

                lignes.add(ligne);
            }
        }

        vente.setLignes(lignes);
        venteRepository.save(vente);

        System.out.println("Vente enregistrée avec succès !");
        return ResponseEntity.ok("Vente enregistrée avec succès");

    } catch (Exception e) {
        e.printStackTrace(); // 👈 très important !
        return ResponseEntity.status(500).body("Erreur serveur : " + e.getMessage());
    }
}


    @GetMapping("/{id}")
    public ResponseEntity<?> getVenteById(@PathVariable Integer id) {
        return venteRepository.findById(id)
                .map(vente -> ResponseEntity.ok(new VenteDTO(vente)))
                .orElse(ResponseEntity.notFound().build());
    }

  @DeleteMapping("/{id}")
public ResponseEntity<?> deleteVente(@PathVariable Integer id) {
    try {
        return venteRepository.findById(id).map(vente -> {
            // Nettoyer les lignes associées
            if (vente.getLignes() != null) {
                vente.getLignes().clear();
            }

            // Nettoyer les livraisons associées
            if (vente.getLivraisons() != null) {
                vente.getLivraisons().clear();
            }

            // Sauvegarder les relations nettoyées
            venteRepository.save(vente);

            // Supprimer la vente elle-même
            venteRepository.delete(vente);

            return ResponseEntity.ok("Vente supprimée avec succès");
        }).orElse(ResponseEntity.status(404).body("Vente introuvable"));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Erreur lors de la suppression : " + e.getMessage());
    }
}


    @PutMapping("/{id}")
    public ResponseEntity<?> updateVente(@PathVariable Integer id, @RequestBody VenteDTO venteDTO) {
        return venteRepository.findById(id).map(vente -> {
            vente.setDateVente(LocalDate.parse(venteDTO.getDateVente()));
            vente.setMontantTotal(venteDTO.getMontantTotal());
            vente.setStatut(venteDTO.getStatut());

            User client = userRepository.findById(venteDTO.getIdClient())
                    .orElseThrow(() -> new RuntimeException("Client non trouvé"));
            vente.setClient(client);

            vente.getLignes().clear();
            if (venteDTO.getLignes() != null) {
                for (LigneVenteDTO l : venteDTO.getLignes()) {
                    if (l.getIdProduit() == null) {
                        throw new RuntimeException("idProduit manquant dans une ligne de vente");
                    }

                    Produit produit = produitRepository.findById(l.getIdProduit())
                            .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

                    LigneVente ligne = new LigneVente();
                    ligne.setVente(vente);
                    ligne.setProduit(produit);
                    ligne.setQuantite(l.getQuantite());
                    ligne.setPrix(l.getPrix());
                    ligne.setTotal(l.getTotal());

                    vente.getLignes().add(ligne);
                }
            }

            venteRepository.save(vente);
            return ResponseEntity.ok("Vente mise à jour");

        }).orElse(ResponseEntity.notFound().build());
    }
}
