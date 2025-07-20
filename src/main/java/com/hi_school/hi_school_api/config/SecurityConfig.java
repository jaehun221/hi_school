package com.hi_school.hi_school_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity // Spring Security 활성화
public class SecurityConfig {

    // 1. 비밀번호 암호화를 위한 PasswordEncoder 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCryptPasswordEncoder는 비밀번호를 안전하게 해싱하는 데 사용됩니다.
        return new BCryptPasswordEncoder();
    }

    // 2. CORS(Cross-Origin Resource Sharing) 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 허용할 오리진(프론트엔드 URL). 개발 환경에서는 * 허용.
        // 배포 시에는 React 앱의 실제 도메인을 명시해야 합니다. (예: "http://localhost:3000", "https://your-react-app.com")
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8080"));
        // 허용할 HTTP 메서드 (GET, POST, PUT, DELETE 등)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // 허용할 헤더 (Authorization 헤더 등)
        configuration.setAllowedHeaders(List.of("*")); // 모든 헤더 허용
        // 자격 증명(쿠키, HTTP 인증, SSL 클라이언트 인증서)을 허용할지 여부
        configuration.setAllowCredentials(true);
        // CORS 사전 요청(pre-flight request) 결과를 캐시할 시간 (초 단위)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 CORS 설정 적용
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 3. HTTP 보안 필터 체인 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS 설정 적용. 위에서 정의한 corsConfigurationSource 빈을 사용합니다.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // CSRF(Cross-Site Request Forgery) 보호 비활성화.
                // REST API 서버는 일반적으로 세션 기반 인증을 사용하지 않으므로 CSRF 보호가 필요 없습니다.
                .csrf(AbstractHttpConfigurer::disable)
                // 세션 관리 전략 설정: STATELESS (상태 비저장)
                // JWT나 Firebase ID Token과 같은 토큰 기반 인증을 사용할 때 세션을 사용하지 않습니다.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // HTTP 요청에 대한 인가(권한 부여) 규칙 설정
                .authorizeHttpRequests(authorize -> authorize
                        // /auth/** 경로는 모든 사용자에게 접근 허용 (로그인, 회원가입 등)
                        .requestMatchers("/auth/**", "/users/signup").permitAll()
                        // 나머지 모든 요청은 인증된 사용자만 접근 허용
                        .anyRequest().authenticated()
                );
        // TODO: Firebase ID Token 검증 필터 추가 (다음 단계에서 구현)
        // .addFilterBefore(new FirebaseTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
