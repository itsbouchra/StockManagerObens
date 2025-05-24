package com.stock.stockmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.model.Categorie;
import com.stock.stockmanager.repository.CategorieRepository;

@RestController
@RequestMapping("/categories")
// @CrossOrigin(origins = "*")

public class CategorieController {

    @Autowired
    private CategorieRepository categorieRepository;

    @GetMapping("/all")
    public List<Categorie> getCategories() {
        return categorieRepository.findAll();
    }
    
}
