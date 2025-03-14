package com.ecolyzer.ecolyzer_backend.mapper;

import com.ecolyzer.ecolyzer_backend.dto.embedded.DeviceEmbeddedDTO;
import com.ecolyzer.ecolyzer_backend.dto.request.ZoneRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ZoneResponseDTO;
import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.Zone;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ZoneMapper {
    @Mapping(target = "devices", source = "devices")
    ZoneResponseDTO toResponseDTO(Zone zone);

    List<DeviceEmbeddedDTO> toDeviceDTOs(List<Device> devices);

    Zone toEntity(ZoneRequestDTO zoneRequestDTO);
}
