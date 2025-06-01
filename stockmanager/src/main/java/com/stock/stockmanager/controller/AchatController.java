package com.stock.stockmanager.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.dto.AchatDTO;
import com.stock.stockmanager.repository.AchatRepository;

@RestController
@RequestMapping("/api/achats")
public class AchatController {
    @Autowired
    private AchatRepository achatRepository;

   @GetMapping
public List<AchatDTO> getAllAchats() {
    return achatRepository.findAllWithUser().stream()
        .map(AchatDTO::new)
        .collect(Collectors.toList());
}


@GetMapping("/test")
public String testApi() {
    return "API is working";
}


}
