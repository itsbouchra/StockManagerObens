package com.stock.stockmanager.dto;

import com.stock.stockmanager.model.LigneAchat;

public class LigneAchatDTO {
    private Integer idProduit;
    private String nomProduit;
    private Integer quantite;
    private Double prix;
    private Double total;

    public LigneAchatDTO() {}

    public LigneAchatDTO(LigneAchat ligne) {
        this.idProduit = ligne.getProduit().getId();
        this.nomProduit = ligne.getProduit().getNom();
        this.quantite = ligne.getQuantite();
        this.prix = ligne.getPrix();
        this.total = ligne.getTotal();
    }

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
