package com.stock.stockmanager.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.LivraisonRequest;
import com.stock.stockmanager.dto.LivraisonResponseDTO;
import com.stock.stockmanager.dto.ProduitDTO;
import com.stock.stockmanager.model.Livraison;
import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.model.Reception;
import com.stock.stockmanager.model.Vente;
import com.stock.stockmanager.repository.LivraisonRepository;
import com.stock.stockmanager.repository.ProduitRepository;
import com.stock.stockmanager.repository.ReceptionRepository;
import com.stock.stockmanager.repository.VenteRepository;

@RestController
public class LivraisonController {

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private LivraisonRepository livraisonRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private ReceptionRepository receptionRepository;

    @PostMapping("/livraisons")
    public ResponseEntity<?> enregistrerLivraisons(@RequestBody List<LivraisonRequest> requests) {
        for (LivraisonRequest request : requests) {
            Vente vente = venteRepository.findById(request.getIdVente())
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));

            Produit produit = produitRepository.findById(request.getIdProduit())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

            Livraison livraison = new Livraison();
            livraison.setVente(vente);
            livraison.setProduit(produit);
            livraison.setDateLivraison(request.getDateLivraison());
            livraison.setQuantite(request.getQuantite());
            livraison.setStatut(request.getStatut());

            String refLotFinal = request.getRefLot();
            if ("FIFO".equalsIgnoreCase(refLotFinal)) {
                List<Reception> lots = receptionRepository.findLotsFIFOByProduitId(request.getIdProduit());
                int quantiteDemandee = request.getQuantite();
                for (Reception lot : lots) {
                    if (lot.getQuantiteRestante() >= quantiteDemandee) {
                        refLotFinal = lot.getRefLot();
                        lot.setQuantiteRestante(lot.getQuantiteRestante() - quantiteDemandee);
                        receptionRepository.save(lot);
                        break;
                    }
                }
                if ("FIFO".equalsIgnoreCase(refLotFinal)) {
                    refLotFinal = "Indéfini";
                }
            } else {
                // Use the provided refLot for manual entry
                refLotFinal = request.getRefLot();
            }
            livraison.setRefLot(refLotFinal);
            livraisonRepository.save(livraison);
        }

        // ✅ Vérifier si tous les produits sont totalement livrés pour la dernière vente traitée
        if (!requests.isEmpty()) {
            LivraisonRequest lastRequest = requests.get(requests.size() - 1);
            Vente vente = venteRepository.findById(lastRequest.getIdVente())
                .orElseThrow(() -> new RuntimeException("Vente non trouvée"));
            boolean allProductsDelivered = vente.getLignes().stream().allMatch(ligne -> {
                int totalLivre = livraisonRepository.sumQuantiteConformeByVenteAndProduit(vente.getId(), ligne.getProduit().getId());
                return totalLivre >= ligne.getQuantite();
            });
            if (allProductsDelivered) {
                vente.setStatut("Livré");
            } else {
                vente.setStatut("En attente");
            }
            venteRepository.save(vente);
        }

        return ResponseEntity.ok().build();
    }

    @PutMapping("/livraison/{venteId}/cloturer")
    public ResponseEntity<?> cloturerVente(@PathVariable Integer venteId) {
        Vente vente = venteRepository.findById(venteId)
            .orElseThrow(() -> new RuntimeException("Vente non trouvée"));

        vente.setStatut("Livré");
        venteRepository.save(vente);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/livraisons")
    public List<LivraisonResponseDTO> getAllLivraisons() {
        return livraisonRepository.findAll().stream()
            .map(LivraisonResponseDTO::new)
            .collect(Collectors.toList());
    }

    @GetMapping("/api/livraisons/count")
    public long countLivraisonsByStatut(@RequestParam String statut) {
        return livraisonRepository.countByStatut(statut);
    }

    @GetMapping("/api/livraisons/vente/{venteId}")
    public ResponseEntity<?> getLivraisonsByVente(@PathVariable Integer venteId) {
        try {
            List<Livraison> livraisons = livraisonRepository.findByVenteId(venteId);
            List<LivraisonResponseDTO> responseDTOs = livraisons.stream()
                .map(livraison -> {
                    LivraisonResponseDTO dto = new LivraisonResponseDTO(livraison);
                    Produit produit = livraison.getProduit();
                    if (produit != null) {
                        ProduitDTO produitDTO = new ProduitDTO();
                        produitDTO.setId(produit.getId());
                        produitDTO.setNom(produit.getNom());
                        produitDTO.setPhoto(produit.getPhoto());
                        produitDTO.setUnit(produit.getUnit());
                        dto.setProduit(produitDTO);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching livraisons: " + e.getMessage());
        }
    }

    @GetMapping("/livraisons/byProduct/{productId}")
    public ResponseEntity<?> getLivraisonsByProduct(@PathVariable Integer productId) {
        try {
            List<Livraison> livraisons = livraisonRepository.findByProduitId(productId);
            List<LivraisonResponseDTO> responseDTOs = livraisons.stream()
                .map(LivraisonResponseDTO::new)
                .collect(Collectors.toList());

            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching livraisons: " + e.getMessage());
        }
    }
}