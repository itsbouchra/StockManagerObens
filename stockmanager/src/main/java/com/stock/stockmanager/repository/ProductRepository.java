package com.stock.stockmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stock.stockmanager.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
