package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.dto.request.ZoneRequestDTO;
import com.ecolyzer.ecolyzer_backend.dto.response.ZoneResponseDTO;
import com.ecolyzer.ecolyzer_backend.mapper.ZoneMapper;
import com.ecolyzer.ecolyzer_backend.model.Zone;
import com.ecolyzer.ecolyzer_backend.repository.ZoneRepository;
import com.ecolyzer.ecolyzer_backend.service.impl.ZoneServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ZoneServiceImplTest {

    @Mock
    private ZoneRepository zoneRepository;

    @Mock
    private ZoneMapper zoneMapper;

    @InjectMocks
    private ZoneServiceImpl zoneService;

    private Zone zone;
    private ZoneRequestDTO zoneRequestDTO;
    private ZoneResponseDTO zoneResponseDTO;

    @BeforeEach
    void setUp() {
        zoneService = new ZoneServiceImpl(zoneRepository, zoneMapper);

        zone = new Zone();
        zone.setId("zone123");
        zone.setName("Test Zone");
        zone.setDescription("Test Description");
        zone.setLocation("Test Location");

        zoneRequestDTO = new ZoneRequestDTO();
        zoneRequestDTO.setName("Test Zone");
        zoneRequestDTO.setDescription("Test Description");
        zoneRequestDTO.setLocation("Test Location");

        zoneResponseDTO = new ZoneResponseDTO();
        zoneResponseDTO.setId("zone123");
        zoneResponseDTO.setName("Test Zone");
        zoneResponseDTO.setDescription("Test Description");
        zoneResponseDTO.setLocation("Test Location");
    }

    @Test
    void getAllZones_ShouldReturnPagedResponse() {
        List<Zone> zones = List.of(zone);
        List<ZoneResponseDTO> zoneDTOs = List.of(zoneResponseDTO);
        Page<ZoneResponseDTO> expectedPage = new PageImpl<>(zoneDTOs, PageRequest.of(0, 10), 1);

        when(zoneRepository.findAllZonesWithDevices(0, 10)).thenReturn(zones);
        when(zoneMapper.toResponseDTO(zone)).thenReturn(zoneResponseDTO);
        when(zoneRepository.count()).thenReturn(1L);

        Page<ZoneResponseDTO> result = zoneService.getAllZones(0, 10);

        assertEquals(expectedPage.getTotalElements(), result.getTotalElements());
        assertEquals(expectedPage.getContent().size(), result.getContent().size());
        verify(zoneRepository, times(1)).findAllZonesWithDevices(0, 10);
    }

    @Test
    void getZoneById_ShouldReturnZone_WhenZoneExists() {
        when(zoneRepository.findById("zone123")).thenReturn(Optional.of(zone));
        when(zoneMapper.toResponseDTO(zone)).thenReturn(zoneResponseDTO);

        ZoneResponseDTO result = zoneService.getZoneById("zone123");

        assertEquals(zoneResponseDTO, result);
        verify(zoneRepository, times(1)).findById("zone123");
    }

    @Test
    void getZoneById_ShouldThrowException_WhenZoneDoesNotExist() {
        when(zoneRepository.findById("zone123")).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            zoneService.getZoneById("zone123");
        });

        assertEquals("Zone not found", exception.getMessage());
        verify(zoneRepository, times(1)).findById("zone123");
    }

    @Test
    void addZone_ShouldSaveAndReturnZoneResponse() {
        when(zoneMapper.toEntity(zoneRequestDTO)).thenReturn(zone);
        when(zoneRepository.save(zone)).thenReturn(zone);
        when(zoneMapper.toResponseDTO(zone)).thenReturn(zoneResponseDTO);

        ZoneResponseDTO result = zoneService.addZone(zoneRequestDTO);

        assertEquals(zoneResponseDTO, result);
        verify(zoneRepository, times(1)).save(zone);
    }

    @Test
    void addZone_ShouldThrowException_WhenNameIsMissing() {
        zoneRequestDTO.setName("");

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            zoneService.addZone(zoneRequestDTO);
        });

        assertEquals("Zone name is required", exception.getMessage());
        verify(zoneRepository, never()).save(any(Zone.class));
    }

    @Test
    void updateZone_ShouldUpdateAndReturnZoneResponse() {
        when(zoneRepository.findById("zone123")).thenReturn(Optional.of(zone));
        when(zoneRepository.save(zone)).thenReturn(zone);
        when(zoneMapper.toResponseDTO(zone)).thenReturn(zoneResponseDTO);

        ZoneResponseDTO result = zoneService.updateZone("zone123", zoneRequestDTO);

        assertEquals(zoneResponseDTO, result);
        verify(zoneRepository, times(1)).save(zone);
    }

    @Test
    void updateZone_ShouldThrowException_WhenZoneDoesNotExist() {
        when(zoneRepository.findById("zone123")).thenReturn(Optional.empty());

        Exception exception = assertThrows(NoSuchElementException.class, () -> {
            zoneService.updateZone("zone123", zoneRequestDTO);
        });

        assertEquals("No value present", exception.getMessage());
        verify(zoneRepository, times(1)).findById("zone123");
        verify(zoneRepository, never()).save(any(Zone.class));
    }

    @Test
    void deleteZone_ShouldCallRepositoryDelete() {
        doNothing().when(zoneRepository).deleteById("zone123");

        assertDoesNotThrow(() -> zoneService.deleteZone("zone123"));

        verify(zoneRepository, times(1)).deleteById("zone123");
    }
}
