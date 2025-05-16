package com.stock.stockmanager.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "produit")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produit")
    private Long id;

    private String nom;
    private String description;
    private String photo;
    private Float prix;

    @Column(name = "stock_min")
    private Integer stockMin;

    private String unit; // e.g. "Kg", "L"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categorie")
    private Categorie categorie;

    @OneToMany(mappedBy = "produit")
    private List<Stock> stocks;

    @OneToMany(mappedBy = "produit")
    private List<Reception> receptions;

    @OneToMany(mappedBy = "produit")
    private List<Livraison> livraisons;

    public Produit(String photo) {
        this.photo = photo;
    }

    public Produit(String laptop, int i, double d) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    // Getters and setters...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Float getPrix() {
        return prix;
    }

    public void setPrix(Float prix) {
        this.prix = prix;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getStockMin() {
        return stockMin;
    }

    public void setStockMin(Integer stockMin) {
        this.stockMin = stockMin;
    }

    public List getStocks() {
        return stocks;
    }

    public void setStocks(List stocks) {
        this.stocks = stocks;
    }

    public List getReceptions() {
        return receptions;
    }

    public void setReceptions(List receptions) {
        this.receptions = receptions;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public List getLivraisons() {
        return livraisons;
    }

    public void setLivraisons(List livraisons) {
        this.livraisons = livraisons;
    }
}
