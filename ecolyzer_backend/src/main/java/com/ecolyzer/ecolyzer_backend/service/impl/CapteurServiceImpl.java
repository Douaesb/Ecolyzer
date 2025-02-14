package com.ecolyzer.ecolyzer_backend.service.impl;

import com.ecolyzer.ecolyzer_backend.dto.request.CapteurRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.DeviceResponseDTO;
import com.ecolyzer.ecolyzer_backend.mapper.CapteurMapper;
import com.ecolyzer.ecolyzer_backend.mapper.DeviceMapper;
import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.model.Device;
import com.ecolyzer.ecolyzer_backend.model.SensorType;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.repository.DeviceRepository;
import com.ecolyzer.ecolyzer_backend.service.CapteurService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CapteurServiceImpl implements CapteurService {

    private final CapteurRepository capteurRepository;
    private final DeviceRepository deviceRepository;
    private final CapteurMapper capteurMapper;
    private final DeviceMapper deviceMapper;

    public CapteurServiceImpl(CapteurRepository capteurRepository, DeviceRepository deviceRepository, CapteurMapper capteurMapper, DeviceMapper deviceMapper) {
        this.capteurRepository = capteurRepository;
        this.deviceRepository = deviceRepository;
        this.capteurMapper = capteurMapper;
        this.deviceMapper = deviceMapper;
    }

    @PostConstruct
    public void initializeCapteurs() {
        List<Device> devices = deviceRepository.findAll();

        if (devices.isEmpty()) {
            log.warn("❌ Aucun device trouvé ! Veuillez en créer avant d'initialiser les capteurs.");
            return;
        }

        for (Device device : devices) {
            // Vérifier si des capteurs existent déjà pour cet appareil
            if (!device.getCapteurs().isEmpty()) {
                log.info("✅ Les capteurs existent déjà pour l'appareil : {}", device.getName());
                continue;
            }

            // Création des capteurs à initialiser
            List<Capteur> capteurs = List.of(
                    new Capteur(null, "Capteur de Température", SensorType.TEMPERATURE, device),
                    new Capteur(null, "Capteur d'Énergie", SensorType.ENERGY, device),
                    new Capteur(null, "Capteur d'Humidité", SensorType.HUMIDITY, device)
            );

            capteurRepository.saveAll(capteurs);

            log.info("✅ Capteurs initialisés pour l'appareil : {}", device.getName());
        }
    }


//    @PostConstruct
//    public void initializeCapteurs() {
//        List<DeviceResponseDTO> devices = deviceRepository.findAll()
//                .stream()
//                .map(deviceMapper::toResponseDTO)
//                .toList();
//
//        if (devices.isEmpty()) {
//            log.warn("❌ No devices found! Please create a device before initializing sensors.");
//            return;
//        }
//
//
//        for (DeviceResponseDTO device : devices) {
////            List<Capteur> existingSensors = capteurRepository.findByDeviceId(device.getId());
//            List<Capteur> existingSensors = device.getCapteurs().stream().map(capteurMapper::toEntity).toList();
//
//            if (!existingSensors.isEmpty()) {
//                log.info("✅ Sensors already exist for Device: {}", device.getName());
//                continue;
//            }
//
//            List<CapteurRequestDTO> sensorDTOs = List.of(
//                    new CapteurRequestDTO("Temperature Sensor", SensorType.TEMPERATURE, device.getId()),
//                    new CapteurRequestDTO("Energy Sensor", SensorType.ENERGY, device.getId()),
//                    new CapteurRequestDTO("Humidity Sensor", SensorType.HUMIDITY, device.getId())
//            );
//
//            List<Capteur> capteurs = sensorDTOs.stream()
//                    .map(capteurMapper::toEntity)
//                    .toList();
//
//            capteurRepository.saveAll(capteurs);
//
//            log.info("✅ Initialized sensors for Device: {}", device.getName());
//        }
//    }
}
