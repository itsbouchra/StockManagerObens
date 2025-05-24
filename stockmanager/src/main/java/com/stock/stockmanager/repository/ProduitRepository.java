package com.stock.stockmanager.repository;

import com.stock.stockmanager.model.Produit;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {

    @Query("SELECT COUNT(p) FROM Produit p")
    int countAllProduits();

    @Query("""
        SELECT p.id 
        FROM Produit p 
        LEFT JOIN p.stocks s 
        GROUP BY p.id 
        HAVING COALESCE(SUM(s.qteDisponible), 0) = 0
    """)
    List<Long> countOutOfStockProductsIds();

    @Query("""
        SELECT p.id 
        FROM Produit p 
        LEFT JOIN p.stocks s 
        GROUP BY p.id, p.stockMin 
        HAVING COALESCE(SUM(s.qteDisponible), 0) <= p.stockMin
    """)
    List<Long> countLowStockProductsIds();

    default int countOutOfStock() {
        return countOutOfStockProductsIds().size();
    }

    default int countLowStock() {
        return countLowStockProductsIds().size();
    }
}
