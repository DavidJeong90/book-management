package com.example.bookmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${CORS_ORIGINS:http://localhost:3000}")
    private String corsOrigins;//

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = corsOrigins.split(",");

        registry.addMapping("/**")
                .allowedOrigins(origins) // 정확한 프론트엔드 주소 배열 주입
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true) // 인증 정보(쿠키/헤더) 허용
                .maxAge(3600);
    }
}