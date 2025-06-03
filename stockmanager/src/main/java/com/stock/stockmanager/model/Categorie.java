package com.stock.stockmanager.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "categorie")
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categorie")
    private Integer id_categorie;

    private String nom;
    private String description;

    @JsonProperty("id_categorie")
    public Integer getIdCategorie() {
        return id_categorie;
    }

    public void setIdCategorie(Integer id_categorie) {
        this.id_categorie = id_categorie;
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

    public Categorie() {}

    @OneToMany(mappedBy = "categorie", cascade = CascadeType.ALL)
    @JsonIgnore // Ajoute cette annotation
    private List<Produit> produits;


    public Categorie(String nom, String description) {
        this.nom = nom;
        this.description = description;
    }


    @Override
    public String toString() {
        return "Categorie{id=" + id_categorie + ", nom='" + nom + "', description='" + description + "'}";
    }

    public List<Produit> getProduits() {
        return produits;
    }

    public void setProduits(List<Produit> produits) {
        this.produits = produits;
    }

}
