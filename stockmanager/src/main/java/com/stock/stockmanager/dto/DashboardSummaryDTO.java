package com.stock.stockmanager.dto;

import java.util.List;

public class DashboardSummaryDTO {
    // Existing fields you might have for your dashboard summary
    private Integer totalProducts;
    private Integer outOfStock;
    private Integer lowStock;

    // New fields for recent activities
    private Integer recentActivityCount;
    private List<RecentActivityDTO> activities;

    // Constructors
    public DashboardSummaryDTO() {
    }

    public DashboardSummaryDTO(Integer totalProducts, Integer outOfStock, Integer lowStock,
                               Integer recentActivityCount, List<RecentActivityDTO> activities) {
        this.totalProducts = totalProducts;
        this.outOfStock = outOfStock;
        this.lowStock = lowStock;
        this.recentActivityCount = recentActivityCount;
        this.activities = activities;
    }

    // Getters and Setters for all fields:

    public Integer getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Integer totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Integer getOutOfStock() {
        return outOfStock;
    }

    public void setOutOfStock(Integer outOfStock) {
        this.outOfStock = outOfStock;
    }

    public Integer getLowStock() {
        return lowStock;
    }

    public void setLowStock(Integer lowStock) {
        this.lowStock = lowStock;
    }

    public Integer getRecentActivityCount() {
        return recentActivityCount;
    }

    public void setRecentActivityCount(Integer recentActivityCount) {
        this.recentActivityCount = recentActivityCount;
    }

    public List<RecentActivityDTO> getActivities() {
        return activities;
    }

    public void setActivities(List<RecentActivityDTO> activities) {
        this.activities = activities;
    }
}

