package com.stock.stockmanager.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "achat")
public class Achat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_achat")
  private Integer id; 
    @Column(name = "date_achat")
    private LocalDate dateAchat;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "id_fournisseur")
    // private User fournisseur;

    @Column(name = "montant_total")
    private Double montantTotal;

    private String statut;

    @OneToMany(mappedBy = "achat")
    private List<Reception> receptions;

    // Getters and setters...

    public LocalDate getDateAchat() {
        return dateAchat;
    }

    public void setDateAchat(LocalDate dateAchat) {
        this.dateAchat = dateAchat;
    }

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

    public List<Reception> getReceptions() {
        return receptions;
    }

    public void setReceptions(List<Reception> receptions) {
        this.receptions = receptions;
    }

  public Integer getId() {   // <-- getter en Integer
        return id;
    }
      public void setId(Integer id) {  // <-- setter en Integer
        this.id = id;
    }
}
