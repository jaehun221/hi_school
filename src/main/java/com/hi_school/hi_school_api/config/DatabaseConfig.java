package com.hi_school.hi_school_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.yourcompany.community") // JPA Repository 스캔 경로 설정
@EnableJpaAuditing // JPA Auditing 활성화 (생성일, 수정일 자동화 등)
public class DatabaseConfig {
    // 이 클래스에서는 별도의 빈(Bean) 정의 없이,
    // 주로 @Configuration 어노테이션을 통해 JPA 관련 설정을 활성화합니다.
    // 실제 데이터베이스 연결 정보는 application.properties/yml에서 관리됩니다.
}