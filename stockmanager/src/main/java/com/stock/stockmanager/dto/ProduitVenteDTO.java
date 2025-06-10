package com.stock.stockmanager.dto;

public class ProduitVenteDTO {
    private Integer idProduit;
    private String nomProduit;
    private int quantiteVente;

    public ProduitVenteDTO(Integer idProduit, String nomProduit, int quantiteVente) {
        this.idProduit = idProduit;
        this.nomProduit = nomProduit;
        this.quantiteVente = quantiteVente;
    }

    public Integer getIdProduit() { return idProduit; }
    public String getNomProduit() { return nomProduit; }
    public int getQuantiteVente() { return quantiteVente; }

    public void setIdProduit(Integer idProduit) { this.idProduit = idProduit; }
    public void setNomProduit(String nomProduit) { this.nomProduit = nomProduit; }
    public void setQuantiteVente(int quantiteVente) { this.quantiteVente = quantiteVente; }
}
