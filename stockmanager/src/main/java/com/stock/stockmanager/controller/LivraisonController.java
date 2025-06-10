package com.stock.stockmanager.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.LivraisonDTO;
import com.stock.stockmanager.dto.LivraisonRequest;
import com.stock.stockmanager.model.LigneVente;
import com.stock.stockmanager.model.Livraison;
import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.model.Vente;
import com.stock.stockmanager.repository.LivraisonRepository;
import com.stock.stockmanager.repository.ProduitRepository;
import com.stock.stockmanager.repository.VenteRepository;

@RestController
@CrossOrigin(origins = "*")
public class LivraisonController {

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private LivraisonRepository livraisonRepository;

    @PostMapping("/livraisons")
    public ResponseEntity<?> enregistrerLivraisons(@RequestBody LivraisonRequest request) {
        Vente vente = venteRepository.findById(request.getVenteId()).orElseThrow();
        vente.setStatut(request.getVenteStatut());
        venteRepository.save(vente);

        for (LivraisonDTO dto : request.getLivraisons()) {
            Livraison livraison = new Livraison();
            livraison.setVente(vente);
            Produit produit = produitRepository.findById(dto.getIdProduit()).orElseThrow();
            livraison.setProduit(produit);

            // ✅ Correction : parser la date string -> LocalDate
            livraison.setDateLivraison(LocalDate.parse(dto.getDateLivraison()));
            livraison.setQuantite(dto.getQuantite());
            livraison.setStatut(dto.getStatut());

            // ✅ Correction : correspond au champ `refLot`
            livraison.setRefLot(dto.getRefColis());

            livraisonRepository.save(livraison);
        }

        // ✅ Clôture automatique si tous les produits sont livrés
        boolean allDelivered = true;
        for (LigneVente ligne : vente.getLignes()) {
            int totalLivree = livraisonRepository.sumQuantiteLivreeByVenteAndProduit(
                vente.getId(), 
                ligne.getProduit().getId()
            );
            if (totalLivree < ligne.getQuantite()) {
                allDelivered = false;
                break;
            }
        }

        if (allDelivered) {
            vente.setStatut("Livree");
            venteRepository.save(vente);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/livraisons")
    public List<Livraison> getAllLivraisons() {
        return livraisonRepository.findAll();
    }
}
