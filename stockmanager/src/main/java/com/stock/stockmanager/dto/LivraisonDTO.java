// LivraisonDTO.java
package com.stock.stockmanager.dto;

public class LivraisonDTO {
    private Integer idProduit;
    private String dateLivraison;
    private Integer quantite;
    private String statut;
    private String refColis;

    // Getters & Setters
    public Integer getIdProduit() { return idProduit; }
    public void setIdProduit(Integer idProduit) { this.idProduit = idProduit; }

    public String getDateLivraison() { return dateLivraison; }
    public void setDateLivraison(String dateLivraison) { this.dateLivraison = dateLivraison; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getRefColis() { return refColis; }
    public void setRefColis(String refColis) { this.refColis = refColis; }
}
