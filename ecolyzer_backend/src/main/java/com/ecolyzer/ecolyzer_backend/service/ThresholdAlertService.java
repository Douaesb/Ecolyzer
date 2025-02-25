package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.dto.request.ThresholdAlertRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ThresholdAlertResponseDTO;
import com.ecolyzer.ecolyzer_backend.model.AlertStatus;

import java.util.List;

public interface ThresholdAlertService {
    ThresholdAlertResponseDTO createThresholdAlert(ThresholdAlertRequestDTO requestDTO);
    List<ThresholdAlertResponseDTO> getThresholdAlertsByDevice(String deviceId);
    ThresholdAlertResponseDTO updateThresholdAlert(String id, ThresholdAlertRequestDTO requestDTO);
    void deleteThresholdAlert(String id);
    ThresholdAlertResponseDTO updateThresholdAlertStatus(String id, AlertStatus status);

}
