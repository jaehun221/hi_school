package com.hi_school.hi_school_api.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct; // Jakarta EE 9+ 환경에서는 jakarta.annotation.PostConstruct 사용

import java.io.FileInputStream;
import java.io.IOException;

@Configuration // 이 클래스를 Spring 설정 클래스로 지정
public class FirebaseConfig {

    // Firebase Admin SDK 초기화는 애플리케이션 시작 시 한 번만 수행되어야 합니다.
    // @PostConstruct를 사용하여 빈 생성 후 초기화 로직을 실행합니다.
    @PostConstruct
    public void initialize() throws IOException {
        // 1. 서비스 계정 키 파일 경로 지정
        // 이 경로는 실제 프로젝트에 맞게 수정해야 합니다.
        // 예: src/main/resources/serviceAccountKey.json
        // 또는 외부 경로 (배포 환경에서는 더 안전)
        FileInputStream serviceAccount =
                new FileInputStream("src/main/resources/hischool-17ded-firebase-adminsdk-fbsvc-c9882e4648.json"); // TODO: 실제 파일 경로로 변경하세요!

        // FirebaseOptions 객체 생성 및 초기화
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        // FirebaseApp이 이미 초기화되었는지 확인 (중복 초기화 방지)
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
            System.out.println("Firebase Admin SDK initialized successfully.");
        } else {
            System.out.println("Firebase Admin SDK already initialized.");
        }
    }

    // FirebaseAuth 인스턴스를 Spring 빈으로 등록
    @Bean
    public FirebaseAuth firebaseAuth() {
        return FirebaseAuth.getInstance();
    }
}
