package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.model.Zone;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ZoneRepository extends MongoRepository<Zone, String> {
    boolean existsByName(String name);

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'devices', localField: '_id', foreignField: 'zone.$id', as: 'devices' } }",
            "{ $skip: ?0 }",
            "{ $limit: ?1 }"
    })
    List<Zone> findAllZonesWithDevices(int skip, int limit);

    Optional<Zone> findByName(String name);


}