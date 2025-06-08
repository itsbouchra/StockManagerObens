package com.stock.stockmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stock.stockmanager.model.Reception;

public interface ReceptionRepository extends JpaRepository<Reception, Integer> {
	@Query("SELECT COALESCE(SUM(r.quantite),0) FROM Reception r WHERE r.achat.id = :achatId AND r.produit.id = :produitId AND (r.statut = 'Conforme' OR r.statut = 'Semi-Conforme')")
	int sumQuantiteConformeByAchatAndProduit(@Param("achatId") Integer achatId, @Param("produitId") Integer produitId);

	List<Reception> findByAchatId(Integer achatId);

	List<Reception> findByProduitId(Integer produitId);

	long countByStatut(String statut);
}