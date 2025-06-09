package com.stock.stockmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stock.stockmanager.model.Livraison;

public interface LivraisonRepository extends JpaRepository<Livraison, Integer> {
}
