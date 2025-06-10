package com.stock.stockmanager.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.stock.stockmanager.model.User;
import com.stock.stockmanager.model.Vente;

public class VenteDTO {

    private Integer id;
    private String dateVente;
    private Double montantTotal;
    private String statut;
    private String username;
    private String nomClient;
    private Integer idClient;
    private List<LigneVenteDTO> lignes;

    // Constructeur par défaut
    public VenteDTO() {}

    // Constructeur à partir d'un objet Vente
    public VenteDTO(Vente vente) {
        if (vente == null) return;

        this.id = vente.getId();
        this.dateVente = (vente.getDateVente() != null) ? vente.getDateVente().toString() : null;
        this.montantTotal = vente.getMontantTotal();
        this.statut = vente.getStatut();

        User client = vente.getClient();
        if (client != null && "client".equalsIgnoreCase(client.getRole())) {
            this.username = client.getUsername();
            this.nomClient = client.getUsername();
            this.idClient = client.getId_user();
        } else {
            this.username = null;
            this.nomClient = null;
            this.idClient = null;
        }

        // Log facultatif pour debug
        System.out.println("Nombre de lignes pour vente " + vente.getId() + " : " + 
            (vente.getLignes() != null ? vente.getLignes().size() : 0));

        if (vente.getLignes() != null) {
            this.lignes = vente.getLignes().stream()
                .map(LigneVenteDTO::new)
                .collect(Collectors.toList());
        }
    }

    // Getters & Setters
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getDateVente() {
        return dateVente;
    }
    public void setDateVente(String dateVente) {
        this.dateVente = dateVente;
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

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getNomClient() {
        return nomClient;
    }
    public void setNomClient(String nomClient) {
        this.nomClient = nomClient;
    }

    public Integer getIdClient() {
        return idClient;
    }
    public void setIdClient(Integer idClient) {
        this.idClient = idClient;
    }

    public List<LigneVenteDTO> getLignes() {
        return lignes;
    }
    public void setLignes(List<LigneVenteDTO> lignes) {
        this.lignes = lignes;
    }
}
