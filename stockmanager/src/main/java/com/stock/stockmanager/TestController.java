package com.stock.stockmanager;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public MessageResponse testApi() {
        return new MessageResponse("Hello from Spring Boot!");
    }
}
