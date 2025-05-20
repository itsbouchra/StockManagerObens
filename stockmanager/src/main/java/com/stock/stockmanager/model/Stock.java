package com.stock.stockmanager.model;

import java.time.LocalDate;
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
@Table(name = "stock")
public class Stock {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_stock")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit")
    private Produit produit;

    @Column(name = "code_reference")
    private String codeReference;

    @Column(name = "qte_disponible")
    private Integer qteDisponible;

    @Column(name = "qte_minimale")
    private Integer qteMinimale;

    @Column(name = "date_dernier_maj")
    private LocalDate dateDernierMaj;

    @OneToMany(mappedBy = "stock")
    private List<Activity> mouvements;

    // getters & setters

    public List<Activity> getMouvements() {
        return mouvements;
    }

    public void setMouvements(List<Activity> mouvements) {
        this.mouvements = mouvements;
    }

    public Produit getProduit() {
        return produit;
    }

    public void setProduit(Produit produit) {
        this.produit = produit;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCodeReference() {
        return codeReference;
    }

    public void setCodeReference(String codeReference) {
        this.codeReference = codeReference;
    }

    public Integer getQteDisponible() {
        return qteDisponible;
    }

    public void setQteDisponible(Integer qteDisponible) {
        this.qteDisponible = qteDisponible;
    }

    public LocalDate getDateDernierMaj() {
        return dateDernierMaj;
    }

    public void setDateDernierMaj(LocalDate dateDernierMaj) {
        this.dateDernierMaj = dateDernierMaj;
    }

    public Integer getQteMinimale() {
        return qteMinimale;
    }

    public void setQteMinimale(Integer qteMinimale) {
        this.qteMinimale = qteMinimale;
    }
}
