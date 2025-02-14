package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.model.SensorData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface SensorDataRepository extends MongoRepository<SensorData, String> {

    @Query("{ 'type': 'ENERGY', 'processed': false }")
    List<SensorData> findUnprocessedEnergyData();

    @Query(value = "{ 'device.id': ?0, 'timestamp': { $gte: ?1, $lte: ?2 } }", fields = "{ 'value': 1 }")
    List<SensorData> findEnergyDataForDeviceBetween(String deviceId, LocalDateTime start, LocalDateTime end);

}
