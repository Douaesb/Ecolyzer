package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.dto.embedded.EnergyConsumptionSummaryDTO;
import com.ecolyzer.ecolyzer_backend.model.EnergyConsumption;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface EnergyConsumptionRepository extends MongoRepository<EnergyConsumption, String> {
    Optional<EnergyConsumption> findByDeviceId(String deviceId);
    Optional<EnergyConsumption> findByDeviceIdAndTimestampBefore(String deviceId, LocalDateTime timestamp);

    List<EnergyConsumption> findByDeviceIdAndTimestampBetween(String deviceId, LocalDateTime start, LocalDateTime end);
    @Aggregation(pipeline = {
            "{ $match: { timestamp: { $gte: ?0 } } }",
            "{ $group: { _id: null, total: { $sum: '$totalConsumption' } } }"
    })
    Double getTotalConsumption(LocalDateTime startDate);
    List<EnergyConsumption> findByTimestampAfter(LocalDateTime startDate);

}
