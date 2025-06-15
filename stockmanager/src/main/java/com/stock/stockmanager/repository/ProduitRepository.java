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

    // Native query to find IDs of products that are out of stock (total received quantity is 0 or less)
    @Query(value = "SELECT p.id_produit FROM produit p LEFT JOIN reception r ON p.id_produit = r.id_produit GROUP BY p.id_produit HAVING SUM(COALESCE(r.quantite, 0)) <= 0", nativeQuery = true)
    List<Integer> findOutOfStockProductIds();

    // Native query to find IDs of products with low stock (total received quantity > 0 and < stock_min)
    @Query(value = "SELECT p.id_produit FROM produit p LEFT JOIN reception r ON p.id_produit = r.id_produit GROUP BY p.id_produit, p.stock_min HAVING SUM(COALESCE(r.quantite, 0)) > 0 AND SUM(COALESCE(r.quantite, 0)) < p.stock_min", nativeQuery = true)
    List<Integer> findLowStockProductIds();

    @Query("SELECT COUNT(p) FROM Produit p")
    Integer countAllProduits();
}
