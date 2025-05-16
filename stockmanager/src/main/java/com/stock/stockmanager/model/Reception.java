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
@Table(name = "reception")
public class Reception {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reception")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_achat")
    private Achat achat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit")
    private Produit produit;

    @Column(name = "date_reception")
    private LocalDate dateReception;

    private Integer quantite;

    @Column(name = "ref_produit")
    private String refProduit;

    private String statut; // conf / semi-conf / non-conf

    @Column(name = "ref_lot")
    private String refLot;

    @OneToMany(mappedBy = "reception")
    private List<Activity> mouvements;

    // Getters and setters...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Achat getAchat() {
        return achat;
    }

    public void setAchat(Achat achat) {
        this.achat = achat;
    }

    public Produit getProduit() {
        return produit;
    }

    public void setProduit(Produit produit) {
        this.produit = produit;
    }

    public LocalDate getDateReception() {
        return dateReception;
    }

    public void setDateReception(LocalDate dateReception) {
        this.dateReception = dateReception;
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

    public String getRefProduit() {
        return refProduit;
    }

    public void setRefProduit(String refProduit) {
        this.refProduit = refProduit;
    }

    public String getRefLot() {
        return refLot;
    }

    public void setRefLot(String refLot) {
        this.refLot = refLot;
    }

    public List<Activity> getMouvements() {
        return mouvements;
    }

    public void setMouvements(List<Activity> mouvements) {
        this.mouvements = mouvements;
    }
}
