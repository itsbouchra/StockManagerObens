package com.stock.stockmanager.repository;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stock.stockmanager.model.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    Collection<String> findTop5ByOrderByTimestampDesc();
    // You can add custom query methods here if needed later
}
