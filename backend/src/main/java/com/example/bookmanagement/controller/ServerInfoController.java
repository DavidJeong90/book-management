package com.example.bookmanagement.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class ServerInfoController {

    /**
     * GET /api/server-info
     * 현재 요청을 처리한 서버 IP·호스트명 반환
     * FE에서 10초마다 호출해 로드밸런싱 전환을 시각화
     */

    @Value("${SERVER_IP:AWS-EB-INSTANCE}")
    private String envServerIp;

    @GetMapping("/api/server-info")
    public ResponseEntity<Map<String, Object>> serverInfo() {
        String ip       = "unknown";
        String hostname = "unknown";
        String activeProfile = System.getProperty("spring.profiles.active", "default");
        try {
            if ("default".equals(activeProfile)) {
                // [로컬 환경] 기존대로 실제 PC 내부 IP 조회
                try {
                    InetAddress addr = InetAddress.getLocalHost();
                    ip       = addr.getHostAddress();
                    hostname = addr.getHostName();
                } catch (Exception ignored) {}
            } else {
                // [AWS 배포 환경] 시스템 자원을 건드리지 않고 환경 변수에서 안전하게 수신
                ip       = envServerIp;
                hostname = "AWS-ElasticBeanstalk-Node";
            }
        } catch (Exception ignored) {}

        // LinkedHashMap으로 순서 보장
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("serverIp",   ip);
        result.put("hostname",   hostname);
        result.put("timestamp",  LocalDateTime.now().toString());
        result.put("message",    "정상 응답");

        return ResponseEntity.ok(result);
    }
}
