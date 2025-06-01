package com.stock.stockmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.stock.stockmanager.model.Achat;

public interface AchatRepository extends JpaRepository<Achat, Integer> {
    @Query("SELECT a FROM Achat a JOIN FETCH a.user")
    List<Achat> findAllWithUser();
}
