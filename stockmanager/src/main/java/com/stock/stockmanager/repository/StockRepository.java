package com.stock.stockmanager.repository;
import com.stock.stockmanager.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {
    // You can add custom methods here if needed
}