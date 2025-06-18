package com.stock.stockmanager.controller;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.server.ResponseStatusException;

import com.stock.stockmanager.dto.LigneVenteDTO;
import com.stock.stockmanager.dto.VenteDTO;
import com.stock.stockmanager.model.LigneVente;
import com.stock.stockmanager.model.Produit;
import com.stock.stockmanager.model.User;
import com.stock.stockmanager.model.Vente;
import com.stock.stockmanager.repository.ProduitRepository;
import com.stock.stockmanager.repository.UserRepository;
import com.stock.stockmanager.repository.VenteRepository;
import com.stock.stockmanager.service.PdfService;


@RestController
@RequestMapping("/api/ventes")
@CrossOrigin(origins = "http://localhost:19006", allowCredentials = "true")

public class VenteController {
    @Autowired
    private PdfService pdfService;

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
            Vente newVente = new Vente();
            newVente.setDateVente(LocalDate.parse(venteDTO.getDateVente()));
            newVente.setMontantTotal(venteDTO.getMontantTotal());
            newVente.setStatut(venteDTO.getStatut());

            User client = userRepository.findById(venteDTO.getIdClient())
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
            newVente.setClient(client);

            List<LigneVente> lignes = new ArrayList<>();
            if (venteDTO.getLignes() != null) {
                for (LigneVenteDTO l : venteDTO.getLignes()) {
                    if (l.getIdProduit() == null) {
                        throw new RuntimeException("idProduit manquant dans une ligne de vente");
                    }

                    Produit produit = produitRepository.findById(l.getIdProduit())
                            .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

                    LigneVente ligne = new LigneVente();
                    ligne.setVente(newVente);
                    ligne.setProduit(produit);
                    ligne.setQuantite(l.getQuantite());
                    ligne.setPrix(l.getPrix());
                    ligne.setTotal(l.getTotal());

                    lignes.add(ligne);
                }
            }

            newVente.setLignes(lignes);
            venteRepository.save(newVente);

            return ResponseEntity.ok("Vente enregistrée avec succès");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de validation : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur : " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVenteById(@PathVariable Integer id) {
        return venteRepository.findById(id)
                .map(vente -> ResponseEntity.ok(new VenteDTO(vente)))
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}/produits")
    public ResponseEntity<List<LigneVenteDTO>> getProduitsByVente(@PathVariable Integer id) {
        return venteRepository.findById(id).map(vente -> {
            List<LigneVenteDTO> lignes = vente.getLignes().stream()
                    .map(LigneVenteDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(lignes);
        }).orElse(ResponseEntity.status(404).build());
    }
@GetMapping("/{id}/facture.pdf")
public ResponseEntity<ByteArrayResource> getFacturePdf(@PathVariable Integer id) {
    try {
        Vente vente = venteRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vente introuvable"));

        byte[] pdfBytes = pdfService.generatePdf(vente);
        ByteArrayResource resource = new ByteArrayResource(pdfBytes);

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=facture_" + id + ".pdf")
            .body(resource);
    } catch (ResponseStatusException e) {
        throw e;
    } catch (Exception e) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors de la génération du PDF", e);
    }
}
   

  @DeleteMapping("/{id}")
public ResponseEntity<?> deleteVente(@PathVariable Integer id) {
    try {
        Optional<Vente> venteOpt = venteRepository.findById(id);
        if (venteOpt.isPresent()) {
            Vente venteToDelete = venteOpt.get();
            if (venteToDelete.getLignes() != null) {
                venteToDelete.getLignes().clear();
            }
            if (venteToDelete.getLivraisons() != null) {
                venteToDelete.getLivraisons().clear();
            }
            venteRepository.save(venteToDelete);
            venteRepository.delete(venteToDelete);
            return ResponseEntity.ok("Vente supprimée avec succès");
        }
        return ResponseEntity.status(404).body("Vente introuvable");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Erreur lors de la suppression : " + e.getMessage());
    }
}


    @PutMapping("/{id}")
    public ResponseEntity<?> updateVente(@PathVariable Integer id, @RequestBody VenteDTO venteDTO) {
        try {
            Optional<Vente> venteOpt = venteRepository.findById(id);
            if (venteOpt.isPresent()) {
                Vente venteToUpdate = venteOpt.get();
                venteToUpdate.setDateVente(LocalDate.parse(venteDTO.getDateVente()));
                venteToUpdate.setMontantTotal(venteDTO.getMontantTotal());
                venteToUpdate.setStatut(venteDTO.getStatut());

                User client = userRepository.findById(venteDTO.getIdClient())
                        .orElseThrow(() -> new RuntimeException("Client non trouvé"));
                venteToUpdate.setClient(client);

                venteToUpdate.getLignes().clear();
                if (venteDTO.getLignes() != null) {
                    for (LigneVenteDTO l : venteDTO.getLignes()) {
                        if (l.getIdProduit() == null) {
                            throw new RuntimeException("idProduit manquant dans une ligne de vente");
                        }

                        Produit produit = produitRepository.findById(l.getIdProduit())
                                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

                        LigneVente ligne = new LigneVente();
                        ligne.setVente(venteToUpdate);
                        ligne.setProduit(produit);
                        ligne.setQuantite(l.getQuantite());
                        ligne.setPrix(l.getPrix());
                        ligne.setTotal(l.getTotal());

                        venteToUpdate.getLignes().add(ligne);
                    }
                }

                venteRepository.save(venteToUpdate);
                return ResponseEntity.ok("Vente mise à jour");
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de validation : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur : " + e.getMessage());
        }
    }
}