package com.stock.stockmanager.controller;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
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
    private static final Logger logger = LoggerFactory.getLogger(AchatController.class);

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

    @GetMapping("/count")
    public long countAchats() {
        return achatRepository.count();
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

    @GetMapping("/{id}/facture.pdf")
    public ResponseEntity<byte[]> generateFacture(@PathVariable Integer id, java.security.Principal principal) {
        try {
            logger.info("Starting invoice generation for achat ID: {}", id);
            
            Achat achat = achatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Achat non trouvé"));
            logger.info("Found achat: {}", achat.getId());

            String documentTitle = "FACTURE D'ACHAT"; // Default title
            logger.info("Principal is null? {}", principal == null);
            if (principal != null) {
                logger.info("Principal name: {}", principal.getName());
                User currentUser = userRepository.findByUsername(principal.getName());
                logger.info("Current user found? {}", currentUser != null);
                if (currentUser != null) {
                    logger.info("Current user role: '{}'", currentUser.getRole());
                    if ("fournisseur".equalsIgnoreCase(currentUser.getRole().trim())) {
                        documentTitle = "BON DE COMMANDE";
                        logger.info("Setting document title to BON DE COMMANDE");
                    }
                }
            }
            logger.info("Document title set to: {}", documentTitle);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);

            document.open();
            logger.info("PDF document opened");

            // En-tête
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph(documentTitle, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Informations de l'achat
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            document.add(new Paragraph("N° Facture: " + achat.getId(), normalFont));
            document.add(new Paragraph("Date: " + achat.getDateAchat(), normalFont));
            document.add(new Paragraph("Fournisseur: " + achat.getUser().getUsername(), normalFont));
            document.add(new Paragraph("\n"));

            // Tableau des produits
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // En-têtes du tableau
            Font tableHeaderFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            table.addCell(new PdfPCell(new Phrase("Produit", tableHeaderFont)));
            table.addCell(new PdfPCell(new Phrase("Quantité", tableHeaderFont)));
            table.addCell(new PdfPCell(new Phrase("Prix unitaire", tableHeaderFont)));
            table.addCell(new PdfPCell(new Phrase("Total", tableHeaderFont)));

            // Données du tableau
            logger.info("Adding products to table. Number of lines: {}", achat.getLignes().size());
            for (LigneAchat ligne : achat.getLignes()) {
                logger.info("Processing line for product: {}", ligne.getProduit().getNom());
                table.addCell(ligne.getProduit().getNom());
                table.addCell(String.valueOf(ligne.getQuantite()));
                table.addCell(String.valueOf(ligne.getPrix()) + " DH");
                table.addCell(String.valueOf(ligne.getQuantite() * ligne.getPrix()) + " DH");
            }

            document.add(table);

            // Total
            Paragraph total = new Paragraph("Total: " + achat.getMontantTotal() + " DH", 
                new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD));
            total.setAlignment(Element.ALIGN_RIGHT);
            total.setSpacingBefore(20);
            document.add(total);

            document.close();
            logger.info("PDF document closed successfully");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "facture_" + id + ".pdf");

            return ResponseEntity.ok()
                .headers(headers)
                .body(baos.toByteArray());

        } catch (DocumentException e) {
            logger.error("Error generating PDF: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage().getBytes());
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage().getBytes());
        }
    }
}
