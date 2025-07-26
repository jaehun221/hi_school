package com.hi_school.hi_school_api.controller;

import com.hi_school.hi_school_api.dto.auth.AuthResponseDto;
import com.hi_school.hi_school_api.dto.auth.SignInRequestDto;
import com.hi_school.hi_school_api.dto.auth.SignUpRequestDto;
import com.hi_school.hi_school_api.dto.global.ApiResponse; // ⭐ 이 부분을 수정합니다.
import com.hi_school.hi_school_api.service.AuthService;
import jakarta.validation.Valid; // @Valid 어노테이션 임포트
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // 이 클래스가 RESTful 웹 서비스의 컨트롤러임을 나타냅니다.
@RequestMapping("/api/auth") // 이 컨트롤러의 모든 엔드포인트는 /api/auth 경로로 시작합니다.
@RequiredArgsConstructor // Lombok: final 필드에 대한 생성자를 자동으로 생성하여 의존성 주입을 돕습니다.
@Slf4j // Lombok: 로깅을 위한 Logger 객체를 자동으로 생성합니다.
public class AuthController {

    private final AuthService authService; // AuthService 의존성 주입

    /**
     * 사용자 회원가입 API
     * 클라이언트로부터 회원가입 요청을 받아 Firebase 및 우리 DB에 사용자 정보를 생성합니다.
     * @param requestDto 회원가입 요청 DTO (이메일, 비밀번호, 닉네임)
     * @return ResponseEntity<ApiResponse<AuthResponseDto>> 회원가입 성공 응답
     */
    @PostMapping("/signup") // POST 요청을 /api/auth/signup 경로로 매핑합니다.
    public ResponseEntity<ApiResponse<AuthResponseDto>> signup(@Valid @RequestBody SignUpRequestDto requestDto) {
        log.info("회원가입 요청 수신: 이메일={}, 닉네임={}", requestDto.getEmail(), requestDto.getNickname());
        try {
            AuthResponseDto responseDto = authService.signup(requestDto);
            // 성공 응답 반환
            return ResponseEntity.status(HttpStatus.CREATED) // HTTP 201 Created 상태 코드
                    .body(ApiResponse.success(responseDto, "회원가입이 성공적으로 완료되었습니다."));
        } catch (IllegalStateException e) {
            log.error("회원가입 실패: {}", e.getMessage());
            // 비즈니스 로직 예외 처리 (예: 중복 이메일/닉네임, Firebase 사용자 생성 실패)
            return ResponseEntity.status(HttpStatus.CONFLICT) // HTTP 409 Conflict 상태 코드
                    .body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("예상치 못한 회원가입 오류 발생: {}", e.getMessage(), e);
            // 그 외 예상치 못한 서버 오류
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // HTTP 500 Internal Server Error
                    .body(ApiResponse.error("회원가입 중 서버 오류가 발생했습니다."));
        }
    }

    /**
     * 사용자 로그인 API
     * 클라이언트로부터 Firebase ID 토큰을 받아 우리 DB에 사용자 정보가 있는지 확인하고 로그인 처리합니다.
     * 실제 Firebase 인증은 클라이언트 측에서 먼저 수행되어야 합니다.
     * @param requestDto 로그인 요청 DTO (Firebase ID 토큰)
     * @return ResponseEntity<ApiResponse<AuthResponseDto>> 로그인 성공 응답
     */
    @PostMapping("/signin") // POST 요청을 /api/auth/signin 경로로 매핑합니다.
    public ResponseEntity<ApiResponse<AuthResponseDto>> signin(@Valid @RequestBody SignInRequestDto requestDto) {
        log.info("로그인 요청 수신: Firebase ID 토큰={}", requestDto.getFirebaseIdToken() != null ? requestDto.getFirebaseIdToken().substring(0, 30) + "..." : "null");
        try {
            AuthResponseDto responseDto = authService.signIn(requestDto.getFirebaseIdToken());

            return ResponseEntity.ok(ApiResponse.success(responseDto, "로그인이 성공적으로 완료되었습니다."));
        } catch (IllegalStateException e) {
            log.error("로그인 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // HTTP 401 Unauthorized 상태 코드
                    .body(ApiResponse.fail(e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("로그인 요청 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST) // HTTP 400 Bad Request 상태 코드
                    .body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("예상치 못한 로그인 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // HTTP 500 Internal Server Error
                    .body(ApiResponse.error("로그인 중 서버 오류가 발생했습니다."));
        }
    }
}
