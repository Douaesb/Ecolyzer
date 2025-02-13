package com.ecolyzer.ecolyzer_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EcolyzerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcolyzerBackendApplication.class, args);
    }

}
