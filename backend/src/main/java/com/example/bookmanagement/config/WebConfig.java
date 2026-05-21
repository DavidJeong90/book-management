package com.example.bookmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;
    @Value("${CORS_ORIGINS:*}")
    private String corsOrigins;
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = (corsOrigins == null || corsOrigins.trim().isEmpty())
                ? new String[]{"*"}
                : corsOrigins.split(",");

        registry.addMapping("/**")
                .allowedOrigins(origins) // 분리된 배열을 안전하게 주입
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
//        registry.addMapping("/api/**")
//                .allowedOrigins(allowedOrigins.split(","))
//                .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true)
//                .maxAge(3600);
    }
}