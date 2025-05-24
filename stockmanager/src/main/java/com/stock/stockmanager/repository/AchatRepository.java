package com.stock.stockmanager.repository;

import com.stock.stockmanager.model.Achat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AchatRepository extends JpaRepository<Achat, Long> {
}
