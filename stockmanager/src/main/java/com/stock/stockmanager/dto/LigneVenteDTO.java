package com.stock.stockmanager.dto;

import com.stock.stockmanager.model.LigneVente;

public class LigneVenteDTO {

    private Integer idProduit;
    private String nomProduit;
    private Integer quantite;
    private Double prix;
    private Double total;

    public LigneVenteDTO() {}

    public LigneVenteDTO(LigneVente ligne) {
        if (ligne != null && ligne.getProduit() != null) {
            this.idProduit = ligne.getProduit().getId();
            this.nomProduit = ligne.getProduit().getNom();
        } else {
            this.idProduit = null;
            this.nomProduit = null;
        }

        this.quantite = ligne != null ? ligne.getQuantite() : 0;
        this.prix = ligne != null ? ligne.getPrix() : 0.0;
        this.total = ligne != null ? ligne.getTotal() : 0.0;
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
