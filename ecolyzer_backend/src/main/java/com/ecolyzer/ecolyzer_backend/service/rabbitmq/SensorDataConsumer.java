package com.ecolyzer.ecolyzer_backend.service.rabbitmq;

import com.ecolyzer.ecolyzer_backend.model.Capteur;
import com.ecolyzer.ecolyzer_backend.model.SensorData;
import com.ecolyzer.ecolyzer_backend.repository.CapteurRepository;
import com.ecolyzer.ecolyzer_backend.repository.SensorDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class SensorDataConsumer {

    private static final Logger logger = LoggerFactory.getLogger(SensorDataConsumer.class);

    private final SensorDataRepository sensorDataRepository;
    private final CapteurRepository capteurRepository;

    public SensorDataConsumer(SensorDataRepository sensorDataRepository, CapteurRepository capteurRepository) {
        this.sensorDataRepository = sensorDataRepository;
        this.capteurRepository = capteurRepository;
    }

    @RabbitListener(queues = "sensor.queue")
    public void receiveSensorData(SensorData data) {
        logger.info("Received message from RabbitMQ: {}", data);
        Capteur capteur = capteurRepository.findById(data.getCapteur().getId()).orElse(null);
        if (capteur == null) {
            logger.warn("Capteur not found for ID: {}", data.getCapteur().getId());
            return;
        }

        data.setCapteur(capteur);
        sensorDataRepository.save(data);
        logger.info("Message saved to MongoDB ✅");
    }
}
