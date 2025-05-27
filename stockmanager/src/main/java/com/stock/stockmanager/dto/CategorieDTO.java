package com.stock.stockmanager.dto;

import java.util.List;

public class CategorieDTO {
    private Integer id_categorie;
    private String nom;
    private String description;

    // Optional: include a list of ProduitDTO if you need it
    private List<ProduitDTO> produits;

    // Getters and setters

    public List<ProduitDTO> getProduits() {
        return produits;
    }

    public void setProduits(List<ProduitDTO> produits) {
        this.produits = produits;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getId_categorie() {
        return id_categorie;
    }

    public void setId_categorie(Integer id_categorie) {
        this.id_categorie = id_categorie;
    }
}
