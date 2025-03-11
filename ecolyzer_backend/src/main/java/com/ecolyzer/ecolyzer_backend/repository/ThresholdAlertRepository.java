package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.dto.embedded.ThresholdAlertEmbeddedDTO;
import com.ecolyzer.ecolyzer_backend.model.AlertStatus;
import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.ThresholdAlert;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ThresholdAlertRepository extends MongoRepository<ThresholdAlert, String> {
    List<ThresholdAlert> findByDeviceId(String deviceId);
    Optional<ThresholdAlert> findByDeviceIdAndActive(String deviceId, boolean active);
    int  countByDeviceIdAndTimestampBetween(String deviceId, LocalDateTime startDay, LocalDateTime endDay);
    long countByStatus(AlertStatus status);
    @Aggregation(pipeline = {
            "{ $match: { timestamp: { $gte: ?0 } } }",
            "{ $count: 'totalAlerts' }"
    })
    Long countAllInPeriod(LocalDateTime startDate);
    List<ThresholdAlert> findByTimestampAfter(LocalDateTime startDate);
    int countByDeviceAndStatus(Device device, String status);

}
