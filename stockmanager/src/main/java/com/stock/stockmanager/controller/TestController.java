package com.stock.stockmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stock.stockmanager.response.MessageResponse;

@RestController
public class TestController {

    @GetMapping("/")
    public MessageResponse testApi() {
        return new MessageResponse("Hello from Spring Boot!");
    }
}
