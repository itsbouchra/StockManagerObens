package com.stock.stockmanager.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "vente")
public class Vente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vente")
    private Long id;

    @Column(name = "date_vente")
    private LocalDate dateVente;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "id_client")
    // private User client;

    @Column(name = "montant_total")
    private Double montantTotal;

    private String statut;

    @OneToMany(mappedBy = "vente")
    private List<Livraison> livraisons;

    // Getters and setters...

    // public User getClient() {
    //     return client;
    // }

    // public void setClient(User client) {
    //     this.client = client;
    // }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateVente() {
        return dateVente;
    }

    public void setDateVente(LocalDate dateVente) {
        this.dateVente = dateVente;
    }

    // public User getClient() {
    //     return client;
    // }

    // public void setClient(User client) {
    //     this.client = client;
    // }

    public Double getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(Double montantTotal) {
        this.montantTotal = montantTotal;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public List<Livraison> getLivraisons() {
        return livraisons;
    }

    public void setLivraisons(List<Livraison> livraisons) {
        this.livraisons = livraisons;
    }
}
