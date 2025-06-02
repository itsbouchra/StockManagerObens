package com.stock.stockmanager.dto;

import java.util.List;

public class ReceptionRequest {
    private Integer achatId;
    private String achatStatut;
    private List<ReceptionDTO> receptions;

    public Integer getAchatId() {
        return achatId;
    }

    public void setAchatId(Integer achatId) {
        this.achatId = achatId;
    }

    public String getAchatStatut() {
        return achatStatut;
    }

    public void setAchatStatut(String achatStatut) {
        this.achatStatut = achatStatut;
    }

    public List<ReceptionDTO> getReceptions() {
        return receptions;
    }

    public void setReceptions(List<ReceptionDTO> receptions) {
        this.receptions = receptions;
    }
}
