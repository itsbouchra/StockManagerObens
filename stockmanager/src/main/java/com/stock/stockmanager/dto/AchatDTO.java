package com.stock.stockmanager.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.stock.stockmanager.model.Achat;
import com.stock.stockmanager.model.User;

public class AchatDTO {
    private Integer idAchat;
    private String dateAchat;
    private Double montantTotal;
    private String statut;
    private String username;
    private String nomFournisseur;
    private Integer idFournisseur;
    private List<LigneAchatDTO> lignes;

    // Default constructor
    public AchatDTO() {}

    // Constructor that takes an Achat object
    public AchatDTO(Achat achat) {
        if (achat == null) return;
        this.idAchat = achat.getId();
        this.dateAchat = (achat.getDateAchat() != null) ? achat.getDateAchat().toString() : null;
        this.montantTotal = achat.getMontantTotal();
        this.statut = achat.getStatut();

        User user = achat.getUser();
        if (user != null && "fournisseur".equalsIgnoreCase(user.getRole())) {
            this.username = user.getUsername();
            this.nomFournisseur = user.getUsername();
            this.idFournisseur = user.getId_user();
        } else {
            this.username = null;
            this.nomFournisseur = null;
            this.idFournisseur = null;
        }
        System.out.println("Nombre de lignes pour achat " + achat.getId() + " : " + (achat.getLignes() != null ? achat.getLignes().size() : 0));
        if (achat.getLignes() != null) {
            this.lignes = achat.getLignes().stream()
                .map(LigneAchatDTO::new)
                .collect(Collectors.toList());
        }
    }

    // Getters and Setters

    public Integer getIdAchat() {
        return idAchat;
    }

    public void setIdAchat(Integer idAchat) {
        this.idAchat = idAchat;
    }

    public String getDateAchat() {
        return dateAchat;
    }

    public void setDateAchat(String dateAchat) {
        this.dateAchat = dateAchat;
    }

    public Double getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(Double montantTotal) {
        this.montantTotal = montantTotal;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getNomFournisseur() {
        return nomFournisseur;
    }

    public void setNomFournisseur(String nomFournisseur) {
        this.nomFournisseur = nomFournisseur;
    }

    public Integer getIdFournisseur() { return idFournisseur; }
    public void setIdFournisseur(Integer idFournisseur) { this.idFournisseur = idFournisseur; }

    public List<LigneAchatDTO> getLignes() { return lignes; }
    public void setLignes(List<LigneAchatDTO> lignes) { this.lignes = lignes; }
}
