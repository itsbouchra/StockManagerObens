package com.stock.stockmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stock.stockmanager.model.Produit;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Integer> {

    @Query("SELECT p FROM Produit p WHERE p.categorie.id = :id")
    List<Produit> findByCategorieId(@Param("id") Integer id);

    // Produits en rupture de stock (toute quantité disponible = 0)
    @Query("SELECT DISTINCT p.id FROM Produit p JOIN p.stocks s WHERE s.qteDisponible = 0")
    List<Integer> findOutOfStockProductIds();

    // Produits avec un stock faible (total < seuil)
    @Query("""
           SELECT p.id FROM Produit p
           JOIN p.stocks s
           GROUP BY p.id
           HAVING SUM(s.qteDisponible) > 0 AND SUM(s.qteDisponible) < :threshold
           """)
    List<Integer> findLowStockProductIds(@Param("threshold") Integer threshold);

    default int countOutOfStock() {
        return findOutOfStockProductIds().size();
    }

    default int countLowStock() {
        return findLowStockProductIds(5).size(); // ou tout autre seuil
    }

    @Query("SELECT COUNT(p) FROM Produit p")
    Integer countAllProduits();
}
