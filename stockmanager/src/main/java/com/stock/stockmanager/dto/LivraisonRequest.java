package com.stock.stockmanager.dto;

import java.util.List;

public class LivraisonRequest {
    private Integer venteId;
    private String venteStatut;
    private List<LivraisonDTO> livraisons;

    public Integer getVenteId() {
        return venteId;
    }

    public void setVenteId(Integer venteId) {
        this.venteId = venteId;
    }

    public String getVenteStatut() {
        return venteStatut;
    }

    public void setVenteStatut(String venteStatut) {
        this.venteStatut = venteStatut;
    }

    public List<LivraisonDTO> getLivraisons() {
        return livraisons;
    }

    public void setLivraisons(List<LivraisonDTO> livraisons) {
        this.livraisons = livraisons;
    }
}
