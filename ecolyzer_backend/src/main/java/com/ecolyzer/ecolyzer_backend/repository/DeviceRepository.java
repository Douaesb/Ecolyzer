package com.ecolyzer.ecolyzer_backend.repository;

import com.ecolyzer.ecolyzer_backend.dto.embedded.DeviceEmbeddedDTO;
import com.ecolyzer.ecolyzer_backend.model.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DeviceRepository extends MongoRepository<Device, String> {

    Page<Device> findByZoneId(String zoneId, Pageable pageable);
    Page<Device> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Device> findBySerialNum(Integer serialNum, Pageable pageable);
    List<Device> findByLastUpdatedAfter(LocalDateTime date);

}
