package com.stock.stockmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stock.stockmanager.model.Livraison;

public interface LivraisonRepository extends JpaRepository<Livraison, Integer> {
    @Query("SELECT COALESCE(SUM(l.quantite),0) FROM Livraison l WHERE l.vente.id = :venteId AND l.produit.id = :produitId AND (l.statut = 'Conforme' OR l.statut = 'Semi-Conforme')")
    int sumQuantiteConformeByVenteAndProduit(@Param("venteId") Integer venteId, @Param("produitId") Integer produitId);

    List<Livraison> findByVenteId(Integer venteId);

    List<Livraison> findByProduitId(Integer produitId);

    long countByStatut(String statut);
}