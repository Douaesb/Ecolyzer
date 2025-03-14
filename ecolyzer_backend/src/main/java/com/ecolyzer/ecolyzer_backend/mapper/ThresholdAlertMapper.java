package com.ecolyzer.ecolyzer_backend.mapper;

import com.ecolyzer.ecolyzer_backend.dto.request.ThresholdAlertRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ThresholdAlertResponseDTO;
import com.ecolyzer.ecolyzer_backend.dto.embedded.ThresholdAlertEmbeddedDTO;
import com.ecolyzer.ecolyzer_backend.model.ThresholdAlert;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ThresholdAlertMapper {

    ThresholdAlertMapper INSTANCE = Mappers.getMapper(ThresholdAlertMapper.class);

    @Mapping(source = "device.id", target = "deviceId")
    ThresholdAlertResponseDTO toResponseDTO(ThresholdAlert alert);

    @Mapping(source = "deviceId", target = "device.id")
    ThresholdAlert toEntity(ThresholdAlertRequestDTO requestDTO);

    ThresholdAlertEmbeddedDTO toEmbeddedDTO(ThresholdAlert alert);
}
