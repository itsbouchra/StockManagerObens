package com.stock.stockmanager.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "mvt_stock")  // link entity to your table
public class Activity {      // you can rename this to MvtStock if you want

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mvt")  // map field to PK column
    private Integer id;

    @Column(name = "dateMvt") // map field to timestamp column
    private LocalDateTime timestamp;

     @Column(name = "quantite") // map field to timestamp column
    private Integer quantite;


      @Column(name = "typeMvt") // map field to timestamp column
    private String typeMvt;


     // Many movements for one stock
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_stock")
    private Stock stock;

     // One movement related to one reception (nullable)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reception", nullable = true)
    private Reception reception;


     // One movement related to one livraison (nullable)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_livraison", nullable = true)
    private Livraison livraison;

    
    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

  

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public String getTypeMvtMvt() {
        return typeMvt;
    }

    public void setTypeMvt(String typeMvt) {
        this.typeMvt = typeMvt;
    }

    public Reception getReception() {
        return reception;
    }

    public void setReception(Reception reception) {
        this.reception = reception;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public Livraison getLivraison() {
        return livraison;
    }

    public void setLivraison(Livraison livraison) {
        this.livraison = livraison;
    }
}
