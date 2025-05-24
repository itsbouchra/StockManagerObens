package com.stock.stockmanager.repository;

import com.stock.stockmanager.model.Vente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenteRepository extends JpaRepository<Vente, Long> {
}
