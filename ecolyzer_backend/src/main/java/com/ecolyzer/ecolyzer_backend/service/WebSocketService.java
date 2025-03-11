package com.ecolyzer.ecolyzer_backend.service;

import com.ecolyzer.ecolyzer_backend.dto.embedded.EnergyDashboardDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendRealTimeUpdateToAllSessions(EnergyDashboardDTO dashboardData) {
        log.info("Sending dashboard update to all connected clients");
        messagingTemplate.convertAndSend("/topic/dashboard-updates", dashboardData);
    }

}