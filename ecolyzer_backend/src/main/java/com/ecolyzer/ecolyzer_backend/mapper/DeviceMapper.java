//package com.ecolyzer.ecolyzer_backend.mapper;
//
//import com.ecolyzer.ecolyzer_backend.dto.request.DeviceRequestDTO;
//import com.ecolyzer.ecolyzer_backend.dto.response.DeviceResponseDTO;
//import com.ecolyzer.ecolyzer_backend.model.Device;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//
//@Mapper(componentModel = "spring")
//public interface DeviceMapper {
//
//    Device toDevice(DeviceRequestDTO dto);
//
//    @Mapping(source = "zone.id", target = "zoneId")
//    DeviceResponseDTO toResponseDTO(Device device);
//}
package com.ecolyzer.ecolyzer_backend.mapper;

import com.ecolyzer.ecolyzer_backend.dto.request.DeviceRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.DeviceResponseDTO;
import com.ecolyzer.ecolyzer_backend.model.Device;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CapteurMapper.class})
public interface DeviceMapper {

    Device toDevice(DeviceRequestDTO dto);

    @Mapping(source = "zone.id", target = "zoneId")
    @Mapping(target = "capteurs", source = "capteurs")
    @Mapping(source = "energyThreshold", target = "energyThreshold")
    DeviceResponseDTO toResponseDTO(Device device);
}
