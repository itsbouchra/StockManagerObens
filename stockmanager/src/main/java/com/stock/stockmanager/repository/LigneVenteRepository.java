package com.stock.stockmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.stock.stockmanager.model.LigneVente;

public interface LigneVenteRepository extends JpaRepository<LigneVente, Integer> {

    // Charger toutes les lignes pour une vente spécifique
    List<LigneVente> findByVenteId(Integer idVente);

    // (optionnel) Si besoin de chargement avec produit
    @Query("SELECT lv FROM LigneVente lv JOIN FETCH lv.produit WHERE lv.vente.id = :idVente")
    List<LigneVente> findWithProduitByVenteId(Integer idVente);
}
