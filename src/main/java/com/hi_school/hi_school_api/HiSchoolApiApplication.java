package com.hi_school.hi_school_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.hi_school.hi_school_api")
@EnableJpaRepositories(basePackages = "com.hi_school.hi_school_api")
@EntityScan(basePackages = "com.hi_school.hi_school_api.domain")
public class HiSchoolApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(HiSchoolApiApplication.class, args);
    }

}
