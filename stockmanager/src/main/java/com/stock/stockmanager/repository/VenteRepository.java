package com.stock.stockmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.stock.stockmanager.model.Vente;

public interface VenteRepository extends JpaRepository<Vente, Integer> {

    // Chargement explicite du client avec chaque vente (évite LazyInitializationException)
    @Query("SELECT v FROM Vente v LEFT JOIN FETCH v.client")
    List<Vente> findAllWithClient();
}
