package com.appleproduct.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Connection;

@Configuration
public class FlywayConfig {

    private static final Logger log = LoggerFactory.getLogger(FlywayConfig.class);

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            try (Connection conn = flyway.getConfiguration().getDataSource().getConnection()) {
                String dbName = conn.getMetaData().getDatabaseProductName().toLowerCase();
                log.info("Detected database engine: {}", dbName);
                if (dbName.contains("h2")) {
                    log.info("H2 in-memory database detected: skipping Flyway SQL migrations. Schema is automatically managed by JPA/Hibernate.");
                    return;
                }
                log.info("Production database engine ({}) detected: running Flyway migrations.", dbName);
                flyway.migrate();
            } catch (Exception e) {
                log.warn("Flyway migration exception: {}. Continuing startup.", e.getMessage());
            }
        };
    }
}
