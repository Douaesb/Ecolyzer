package com.ecolyzer.ecolyzer_backend.mapper;

import com.ecolyzer.ecolyzer_backend.dto.embedded.CapteurEmbeddedDTO;
import com.ecolyzer.ecolyzer_backend.dto.request.CapteurRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.CapteurResponseDTO;
import com.ecolyzer.ecolyzer_backend.model.Capteur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = CapteurMapperHelper.class)
public interface CapteurMapper {

    @Mapping(source = "deviceId", target = "device", qualifiedByName = "mapDeviceIdToDevice")
    Capteur toEntity(CapteurRequestDTO dto);

    @Mapping(source = "device", target = "device")
    CapteurResponseDTO toResponseDTO(Capteur capteur);

    CapteurEmbeddedDTO toEmbeddedDTO(Capteur capteur);
}