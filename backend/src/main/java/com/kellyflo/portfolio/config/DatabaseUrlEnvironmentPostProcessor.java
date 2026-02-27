package com.kellyflo.portfolio.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.util.StringUtils;

public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String datasourceUrl = environment.getProperty("spring.datasource.url");
        if (StringUtils.hasText(datasourceUrl) && datasourceUrl.startsWith("jdbc:")) {
            return;
        }

        String rawDatabaseUrl = firstNonBlank(
                environment.getProperty("SPRING_DATASOURCE_URL"),
                environment.getProperty("DB_URL"),
                environment.getProperty("DATABASE_URL"));
        if (!StringUtils.hasText(rawDatabaseUrl)) {
            return;
        }

        DatabaseConnectionInfo info = parseDatabaseUrl(rawDatabaseUrl.trim());
        if (info == null) {
            return;
        }

        Map<String, Object> overrides = new HashMap<>();
        overrides.put("spring.datasource.url", info.jdbcUrl());

        if (!StringUtils.hasText(environment.getProperty("spring.datasource.username"))
                && StringUtils.hasText(info.username())) {
            overrides.put("spring.datasource.username", info.username());
        }
        if (!StringUtils.hasText(environment.getProperty("spring.datasource.password"))
                && StringUtils.hasText(info.password())) {
            overrides.put("spring.datasource.password", info.password());
        }

        environment.getPropertySources()
                .addFirst(new MapPropertySource("databaseUrlOverrides", overrides));
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value;
            }
        }
        return null;
    }

    private DatabaseConnectionInfo parseDatabaseUrl(String rawUrl) {
        if (rawUrl.startsWith("jdbc:")) {
            return new DatabaseConnectionInfo(rawUrl, null, null);
        }

        String normalized = rawUrl;
        if (rawUrl.startsWith("postgresql://")) {
            normalized = "postgres://" + rawUrl.substring("postgresql://".length());
        }
        if (!normalized.startsWith("postgres://")) {
            return null;
        }

        try {
            URI uri = URI.create(normalized);
            String host = uri.getHost();
            if (!StringUtils.hasText(host)) {
                return null;
            }

            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String database = "";
            if (StringUtils.hasText(uri.getPath()) && uri.getPath().length() > 1) {
                database = uri.getPath().substring(1);
            }

            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + database;
            if (StringUtils.hasText(uri.getRawQuery())) {
                jdbcUrl += "?" + uri.getRawQuery();
            }

            String username = null;
            String password = null;
            if (StringUtils.hasText(uri.getRawUserInfo())) {
                String[] credentials = uri.getRawUserInfo().split(":", 2);
                username = decode(credentials[0]);
                if (credentials.length > 1) {
                    password = decode(credentials[1]);
                }
            }

            return new DatabaseConnectionInfo(jdbcUrl, username, password);
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private record DatabaseConnectionInfo(String jdbcUrl, String username, String password) {
    }
}

