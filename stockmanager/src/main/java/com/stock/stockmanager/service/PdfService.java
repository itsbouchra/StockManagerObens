package com.stock.stockmanager.service;

import java.io.ByteArrayOutputStream;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.stock.stockmanager.model.LigneVente;
import com.stock.stockmanager.model.User;
import com.stock.stockmanager.model.Vente;

@Service
public class PdfService {

    public byte[] generatePdf(Vente vente) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Titre
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("FACTURE DE VENTE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(Chunk.NEWLINE);

            // Infos générales
            User client = vente.getClient();
            document.add(new Paragraph("N° Facture: " + vente.getId()));
            document.add(new Paragraph("Date: " + vente.getDateVente()));
            document.add(new Paragraph("Client: " + client.getUsername()));

            document.add(Chunk.NEWLINE);

            // Tableau
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3, 2, 2, 2});

            // En-têtes
            Stream.of("Produit", "Quantité", "Prix unitaire", "Total")
                .forEach(header -> {
                    PdfPCell cell = new PdfPCell(new Phrase(header));
                    cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(cell);
                });

            // Lignes de vente
            for (LigneVente ligne : vente.getLignes()) {
                table.addCell(ligne.getProduit().getNom());
                table.addCell(String.valueOf(ligne.getQuantite()));
                table.addCell(String.format("%.2f DH", ligne.getPrix()));
                table.addCell(String.format("%.2f DH", ligne.getTotal()));
            }

            document.add(table);

            document.add(Chunk.NEWLINE);

            // Total global
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Paragraph total = new Paragraph("Total: " + vente.getMontantTotal() + " DH", boldFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }
}