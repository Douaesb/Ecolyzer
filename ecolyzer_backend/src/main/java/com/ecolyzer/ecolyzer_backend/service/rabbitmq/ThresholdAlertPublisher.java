package com.ecolyzer.ecolyzer_backend.service.rabbitmq;

import com.ecolyzer.ecolyzer_backend.model.ThresholdAlert;
import com.ecolyzer.ecolyzer_backend.service.WebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import static com.ecolyzer.ecolyzer_backend.config.RabbitMQConfig.ALERT_EXCHANGE;
import static com.ecolyzer.ecolyzer_backend.config.RabbitMQConfig.ALERT_ROUTING_KEY;

@Service
public class ThresholdAlertPublisher {

    private static final Logger logger = LoggerFactory.getLogger(ThresholdAlertPublisher.class);
    private final RabbitTemplate rabbitTemplate;
    private final WebSocketService webSocketService;

    public ThresholdAlertPublisher(RabbitTemplate rabbitTemplate, WebSocketService webSocketService) {
        this.rabbitTemplate = rabbitTemplate;
        this.webSocketService = webSocketService;
    }

    public void sendAlert(ThresholdAlert alert) {
        logger.info("🚨 Publishing alert to RabbitMQ: {}", alert);
        rabbitTemplate.convertAndSend(ALERT_EXCHANGE, ALERT_ROUTING_KEY, alert);
        logger.info("✅ Alert message sent successfully!");
        webSocketService.sendAlertToClients(alert);
    }
}
