package com.hi_school.hi_school_api.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList; // 권한이 없는 경우 빈 리스트 사용

@Component // Spring 빈으로 등록하여 의존성 주입 가능하게 함
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;

    // FirebaseAuth는 FirebaseAdmin SDK 초기화 시 자동으로 주입 가능해집니다.
    public FirebaseTokenFilter(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 요청 헤더에서 Authorization 토큰 추출
        String authorizationHeader = request.getHeader("Authorization");

        // 토큰이 없거나 "Bearer "로 시작하지 않으면 다음 필터로 넘김
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // "Bearer " 접두사를 제거하여 실제 토큰 값만 추출
        String idToken = authorizationHeader.substring(7);

        try {
            // 2. Firebase ID Token 검증
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);

            // 3. 검증된 토큰에서 사용자 정보 추출 및 Spring Security 컨텍스트에 설정
            // Firebase UID를 사용자 이름으로 사용
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail(); // 이메일도 사용 가능

            // UserDetails 객체 생성 (권한은 일단 비워둡니다. 나중에 역할/권한 추가 가능)
            UserDetails userDetails = User.builder()
                    .username(uid) // Firebase UID를 사용자 이름으로 사용
                    .password("") // 비밀번호는 토큰 기반 인증이므로 필요 없음
                    .authorities(new ArrayList<>()) // 사용자 권한 (나중에 역할 추가)
                    .build();

            // 인증 토큰 생성 및 SecurityContextHolder에 설정
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (FirebaseAuthException e) {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.getWriter().write("{\"message\": \"Invalid or expired Firebase ID token\"}");
            response.getWriter().flush();
            response.getWriter().close();
            return; // 여기서 끝내야 다음 필터로 안 넘어감
        }


        // 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }
}