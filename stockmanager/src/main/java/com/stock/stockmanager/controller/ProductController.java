package com.stock.stockmanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.model.Product;
import com.stock.stockmanager.repository.ProductRepository;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Add test product
    @PostMapping("/add")
    public String addProduct() {
        Product p = new Product("Laptop", 10, 1200.50);
        productRepository.save(p);
        return "Product added!";
    }

    // Get all products
    @GetMapping("/all")
    public List<Product> getAll() {
        return productRepository.findAll();
    }
}
