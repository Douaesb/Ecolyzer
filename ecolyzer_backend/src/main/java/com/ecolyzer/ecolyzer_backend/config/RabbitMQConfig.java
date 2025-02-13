package com.ecolyzer.ecolyzer_backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String SENSOR_QUEUE = "sensor.queue";
    public static final String SENSOR_EXCHANGE = "sensor.exchange";
    public static final String SENSOR_ROUTING_KEY = "sensor.data";

    private static final Logger logger = LoggerFactory.getLogger(RabbitMQConfig.class);

    @PostConstruct
    public void logQueueSetup() {
        logger.info("Declaring RabbitMQ queue: " + SENSOR_QUEUE);
    }

    @Bean
    public Queue queue() {
        return new Queue(SENSOR_QUEUE, true); // Durable queue
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(SENSOR_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(SENSOR_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate = new org.springframework.amqp.rabbit.core.RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

//    @Bean
//    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
//        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
//        factory.setConnectionFactory(connectionFactory);
//        factory.setConcurrentConsumers(3);  // Allow up to 3 consumers
//        factory.setMaxConcurrentConsumers(10);
//        return factory;
//    }

}
