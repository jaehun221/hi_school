package com.hi_school.hi_school_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories; // 이 import 문을 추가합니다.

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.hi_school.hi_school_api.domain.user")
public class HiSchoolApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(HiSchoolApiApplication.class, args);
    }

}
