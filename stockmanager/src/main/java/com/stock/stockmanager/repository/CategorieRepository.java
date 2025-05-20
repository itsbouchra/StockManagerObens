package com.stock.stockmanager.repository;

import com.stock.stockmanager.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieRepository extends JpaRepository<Categorie, Integer> {
}
