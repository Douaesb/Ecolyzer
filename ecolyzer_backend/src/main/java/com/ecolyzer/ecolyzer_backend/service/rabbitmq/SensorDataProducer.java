package com.ecolyzer.ecolyzer_backend.service.rabbitmq;

import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.model.SensorData;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.service.SensorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;
import java.util.UUID;

import static com.ecolyzer.ecolyzer_backend.config.RabbitMQConfig.*;

@Service
public class SensorDataProducer {

    private static final Logger logger = LoggerFactory.getLogger(SensorDataProducer.class);

    private final RabbitTemplate rabbitTemplate;
    private final CapteurRepository capteurRepository;
    private final SensorService sensorService;
    private final Random random = new Random();

    public SensorDataProducer(RabbitTemplate rabbitTemplate, CapteurRepository capteurRepository, SensorService sensorService) {
        this.rabbitTemplate = rabbitTemplate;
        this.capteurRepository = capteurRepository;
        this.sensorService = sensorService;
    }

    @Scheduled(fixedRate = 5000)
    public void sendFakeSensorData() {
        String randomCapteurId = sensorService.getRandomCapteurId();

        Capteur capteur = capteurRepository.findById(randomCapteurId).orElse(null);
        if (capteur == null) {
            logger.warn("No valid Capteur found! Cannot send data.");
            return;
        }

        SensorData data = SensorData.builder()
                .id(UUID.randomUUID().toString())
                .value(random.nextDouble() * 100)
                .timestamp(Instant.now())
                .type(capteur.getType())
                .capteur(capteur)
                .processed(false).build();

        logger.info("📡 Sending message to RabbitMQ: {}", data);
        rabbitTemplate.convertAndSend(SENSOR_EXCHANGE, SENSOR_ROUTING_KEY, data);
        logger.info("✅ Message sent successfully!");
    }
}
