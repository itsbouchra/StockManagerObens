package com.stock.stockmanager.repository;

import com.stock.stockmanager.model.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LivraisonRepository extends JpaRepository<Livraison, Integer> {

    @Query("""
        SELECT COALESCE(SUM(l.quantite), 0)
        FROM Livraison l
        WHERE l.vente.id = :venteId AND l.produit.id = :produitId
    """)
    int sumQuantiteLivreeByVenteAndProduit(@Param("venteId") Integer venteId, @Param("produitId") Integer produitId);
}
