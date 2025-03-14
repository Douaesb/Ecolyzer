package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.model.StatusChange;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StatusChangeRepository extends MongoRepository<StatusChange, String> {
}
