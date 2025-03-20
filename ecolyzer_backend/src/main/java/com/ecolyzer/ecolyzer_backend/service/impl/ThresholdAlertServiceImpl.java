package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.request.ThresholdAlertRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ThresholdAlertResponseDTO;
import com.ecolyzer.ecolyzer_backend.mapper.ThresholdAlertMapper;
import com.ecolyzer.ecolyzer_backend.model.AlertStatus;
import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.StatusChange;
import com.ecolyzer.ecolyzer_backend.model.ThresholdAlert;
import com.ecolyzer.ecolyzer_backend.repository.DeviceRepository;
import com.ecolyzer.ecolyzer_backend.repository.StatusChangeRepository;
import com.ecolyzer.ecolyzer_backend.repository.ThresholdAlertRepository;
import com.ecolyzer.ecolyzer_backend.service.ThresholdAlertService;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThresholdAlertServiceImpl implements ThresholdAlertService {

    private final ThresholdAlertRepository thresholdAlertRepository;
    private final DeviceRepository deviceRepository;
    private final ThresholdAlertMapper thresholdAlertMapper;
    private final StatusChangeRepository statusChangeRepository;
    private final SimpMessagingTemplate messagingTemplate;


    public ThresholdAlertServiceImpl(ThresholdAlertRepository thresholdAlertRepository, DeviceRepository deviceRepository, ThresholdAlertMapper thresholdAlertMapper, StatusChangeRepository statusChangeRepository, SimpMessagingTemplate messagingTemplate) {
        this.thresholdAlertRepository = thresholdAlertRepository;
        this.deviceRepository = deviceRepository;
        this.thresholdAlertMapper = thresholdAlertMapper;
        this.statusChangeRepository = statusChangeRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public ThresholdAlertResponseDTO createThresholdAlert(ThresholdAlertRequestDTO requestDTO) {
        Device device = deviceRepository.findById(requestDTO.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found"));

        ThresholdAlert thresholdAlert = ThresholdAlert.builder()
                .device(device)
                .thresholdValue(requestDTO.getThresholdValue())
                .alertMessage(requestDTO.getAlertMessage())
                .active(true)
                .updatedAt(LocalDateTime.now())
                .build();

        ThresholdAlert savedAlert = thresholdAlertRepository.save(thresholdAlert);
        return thresholdAlertMapper.toResponseDTO(savedAlert);
    }

    public List<ThresholdAlertResponseDTO> getThresholdAlertsByDevice(String deviceId) {
        return thresholdAlertRepository.findByDeviceId(deviceId)
                .stream()
                .map(thresholdAlertMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ThresholdAlertResponseDTO updateThresholdAlert(String id, ThresholdAlertRequestDTO requestDTO) {
        ThresholdAlert existingAlert = thresholdAlertRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Threshold Alert not found"));

        existingAlert.updateThreshold(
                requestDTO.getThresholdValue(),
                requestDTO.getAlertMessage(),
                existingAlert.isActive()
        );

        ThresholdAlert updatedAlert = thresholdAlertRepository.save(existingAlert);
        return thresholdAlertMapper.toResponseDTO(updatedAlert);
    }

    public ThresholdAlertResponseDTO updateThresholdAlertStatus(String id, AlertStatus status) {
        ThresholdAlert alert = thresholdAlertRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Threshold Alert not found"));

        StatusChange statusChange = new StatusChange();
        statusChange.setThresholdAlert(alert);
        statusChange.setStatus(status);
        statusChange.setChangedAt(LocalDateTime.now());

        if (alert.getStatusHistory() == null) {
            alert.setStatusHistory(new ArrayList<>());
        }
        alert.getStatusHistory().add(statusChange);
        alert.setStatus(status);
        alert.setUpdatedAt(LocalDateTime.now());

        if (status == AlertStatus.RESOLVED) {
            alert.setActive(false);
        }

        statusChangeRepository.save(statusChange);
        ThresholdAlert updatedAlert = thresholdAlertRepository.save(alert);

        ThresholdAlertResponseDTO responseDTO = thresholdAlertMapper.toResponseDTO(updatedAlert);
        messagingTemplate.convertAndSend("/topic/alerts", responseDTO);

        return responseDTO;
    }


    public void deleteThresholdAlert(String id) {
        if (!thresholdAlertRepository.existsById(id)) {
            throw new RuntimeException("Threshold Alert not found");
        }
        thresholdAlertRepository.deleteById(id);
    }

    @Override
    public List<ThresholdAlertResponseDTO> getAllActiveAlerts() {
        return thresholdAlertRepository.findByActiveTrue()
                .stream()
                .map(thresholdAlertMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
