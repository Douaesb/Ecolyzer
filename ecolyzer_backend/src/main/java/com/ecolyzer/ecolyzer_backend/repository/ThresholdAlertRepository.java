package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.model.ThresholdAlert;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ThresholdAlertRepository extends MongoRepository<ThresholdAlert, String> {
    List<ThresholdAlert> findByDeviceId(String deviceId);
    Optional<ThresholdAlert> findByDeviceIdAndActive(String deviceId, boolean active);
    int  countByDeviceIdAndTimestampBetween(String deviceId, LocalDateTime startDay, LocalDateTime endDay);

}
