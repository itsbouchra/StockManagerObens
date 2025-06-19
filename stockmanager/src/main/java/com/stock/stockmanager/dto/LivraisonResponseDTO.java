package com.stock.stockmanager.dto;

import java.time.LocalDate;

import com.stock.stockmanager.model.Livraison;

public class LivraisonResponseDTO {
    private Integer id;
    private Integer idVente;
    private Integer idProduit;
    private String nomProduit;
    private LocalDate dateLivraison;
    private Integer quantite;
    private String statut;
    private String refLot;
    private ProduitDTO produit;

    public LivraisonResponseDTO(Livraison livraison) {
        this.id = livraison.getId();
        this.idVente = livraison.getVente().getId();
        this.idProduit = livraison.getProduit().getId();
        this.nomProduit = livraison.getProduit().getNom();
        this.dateLivraison = livraison.getDateLivraison();
        this.quantite = livraison.getQuantite();
        this.statut = livraison.getStatut();
        this.refLot = livraison.getRefLot();
        this.produit = new ProduitDTO();
        this.produit.setId(livraison.getProduit().getId());
        this.produit.setNom(livraison.getProduit().getNom());
        this.produit.setPhoto(livraison.getProduit().getPhoto());
        this.produit.setUnit(livraison.getProduit().getUnit());
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdVente() {
        return idVente;
    }

    public void setIdVente(Integer idVente) {
        this.idVente = idVente;
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

    public LocalDate getDateLivraison() {
        return dateLivraison;
    }

    public void setDateLivraison(LocalDate dateLivraison) {
        this.dateLivraison = dateLivraison;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getRefLot() {
        return refLot;
    }

    public void setRefLot(String refLot) {
        this.refLot = refLot;
    }

    public ProduitDTO getProduit() {
        return produit;
    }

    public void setProduit(ProduitDTO produit) {
        this.produit = produit;
    }
}