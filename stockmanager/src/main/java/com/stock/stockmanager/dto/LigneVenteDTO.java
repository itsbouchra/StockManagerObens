package com.stock.stockmanager.dto;

import com.stock.stockmanager.model.LigneVente;
import com.stock.stockmanager.model.Produit;
import java.util.Optional;

public class LigneVenteDTO {

    private Integer idProduit;
    private String nomProduit;
    private Integer quantite;
    private Double prix;
    private Double total;

    public LigneVenteDTO() {}

    public LigneVenteDTO(LigneVente ligneVente) {
        this.idProduit = Optional.ofNullable(ligneVente.getProduit())
            .map(Produit::getId)
            .orElse(null);
        this.nomProduit = Optional.ofNullable(ligneVente.getProduit())
            .map(Produit::getNom)
            .orElse(null);
        this.quantite = Optional.ofNullable(ligneVente.getQuantite())
            .orElse(0);
        this.prix = Optional.ofNullable(ligneVente.getPrix())
            .orElse(0.0);
        this.total = Optional.ofNullable(ligneVente.getTotal())
            .orElse(0.0);
    }

    // === Getters & Setters ===

    public Integer getIdProduit() {
        return idProduit;
    }

    public void setIdProduit(Integer idProduit) {
        this.idProduit = idProduit;
    }

    public String getNomProduit() {
        return nomProduit;
    }

    public void setNomProduit(String nomProduit) {
        this.nomProduit = nomProduit;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}