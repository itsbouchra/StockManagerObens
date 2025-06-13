package com.stock.stockmanager.dto;

import java.time.LocalDate; // Or java.time.LocalDateTime if your dates include time

public class RecentActivityDTO {
    private String type; // "Vente" or "Achat"
    private double montant;
    private LocalDate date; // Use LocalDate if you only store dates, LocalDateTime otherwise
    private Long id; // To identify the original sale/purchase if needed later

    // Constructors
    public RecentActivityDTO() {}

    public RecentActivityDTO(String type, double montant, LocalDate date, Long id) {
        this.type = type;
        this.montant = montant;
        this.date = date;
        this.id = id;
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
