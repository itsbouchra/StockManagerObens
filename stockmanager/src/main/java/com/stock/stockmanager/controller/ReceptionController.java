package com.stock.stockmanager.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.ProduitDTO;
import com.stock.stockmanager.dto.ReceptionDTO;
import com.stock.stockmanager.dto.ReceptionRequest;
import com.stock.stockmanager.dto.ReceptionResponseDTO;
import com.stock.stockmanager.model.Achat;
import com.stock.stockmanager.model.LigneAchat;
import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.model.Reception;
import com.stock.stockmanager.repository.AchatRepository;
import com.stock.stockmanager.repository.ProduitRepository;
import com.stock.stockmanager.repository.ReceptionRepository;

@RestController
public class ReceptionController {

    @Autowired
    private AchatRepository achatRepository;

    @Autowired
    private ReceptionRepository receptionRepository;

    @Autowired
    private ProduitRepository produitRepository; // Ajouté pour récupérer le produit

    @PostMapping("/receptions")
    public ResponseEntity<?> enregistrerReceptions(@RequestBody ReceptionRequest request) {
        // request contient : List<ReceptionDTO> receptions, Integer achatId, String achatStatut
        Achat achat = achatRepository.findById(request.getAchatId()).orElseThrow();
        achat.setStatut(request.getAchatStatut());
        achatRepository.save(achat);

        for (ReceptionDTO dto : request.getReceptions()) {
            Reception reception = new Reception();
            reception.setAchat(achat);
            Produit produit = produitRepository.findById(dto.getIdProduit()).orElseThrow();
            reception.setProduit(produit);
            reception.setDateReception(dto.getDateReception());
            reception.setQuantite(dto.getQuantite());
            reception.setStatut(dto.getStatut());
            reception.setRefLot(dto.getRefLot());
            receptionRepository.save(reception);
        }
        
        // Après avoir enregistré les réceptions
        boolean allProductsReceived = true;
        for (LigneAchat ligne : achat.getLignes()) {
            int totalRecu = receptionRepository.sumQuantiteConformeByAchatAndProduit(achat.getId(), ligne.getProduit().getId());
            if (totalRecu < ligne.getQuantite()) {
                allProductsReceived = false;
                break;
            }
        }
        if (allProductsReceived) {
            achat.setStatut("Réceptionné");
            achatRepository.save(achat);
        }
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/receptions")
    public List<Reception> getAllReceptions() {
        return receptionRepository.findAll();
    }

    @GetMapping("/api/receptions/count")
    public long countReceptionsByStatut(@RequestParam String statut) {
        return receptionRepository.countByStatut(statut);
    }

    @GetMapping("/api/receptions/achat/{achatId}")
    public ResponseEntity<?> getReceptionsByAchat(@PathVariable Integer achatId) {
        try {
            List<Reception> receptions = receptionRepository.findByAchatId(achatId);
            List<ReceptionResponseDTO> responseDTOs = receptions.stream()
                .map(reception -> {
                    ReceptionResponseDTO dto = new ReceptionResponseDTO();
                    dto.setId(reception.getId());
                    dto.setAchatId(reception.getAchat().getId());
                    dto.setDateReception(reception.getDateReception());
                    dto.setQuantite(reception.getQuantite());
                    dto.setStatut(reception.getStatut());
                    dto.setRefLot(reception.getRefLot());
                    
                    // Map produit data
                    Produit produit = reception.getProduit();
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
            return ResponseEntity.badRequest().body("Error fetching receptions: " + e.getMessage());
        }
    }

    @GetMapping("/receptions/byProduct/{productId}")
    public ResponseEntity<?> getReceptionsByProduct(@PathVariable Integer productId) {
        try {
            List<Reception> receptions = receptionRepository.findByProduitId(productId);
            List<ReceptionResponseDTO> responseDTOs = receptions.stream()
                .map(reception -> {
                    ReceptionResponseDTO dto = new ReceptionResponseDTO();
                    dto.setId(reception.getId());
                    dto.setAchatId(reception.getAchat().getId());
                    dto.setDateReception(reception.getDateReception());
                    dto.setQuantite(reception.getQuantite());
                    dto.setStatut(reception.getStatut());
                    dto.setRefLot(reception.getRefLot());
                    dto.setFournisseurNom(reception.getAchat().getUser().getUsername());

                    // Map produit data
                    Produit produit = reception.getProduit();
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
            return ResponseEntity.badRequest().body("Error fetching receptions: " + e.getMessage());
        }
    }
}
