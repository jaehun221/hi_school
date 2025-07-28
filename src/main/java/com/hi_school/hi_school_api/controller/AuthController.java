package com.hi_school.hi_school_api.controller;

import com.hi_school.hi_school_api.dto.auth.AuthResponseDto;
import com.hi_school.hi_school_api.dto.auth.SignInRequestDto;
import com.hi_school.hi_school_api.dto.auth.SignUpRequestDto;
import com.hi_school.hi_school_api.dto.global.ApiResponse;
import com.hi_school.hi_school_api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.FieldError; // FieldError 임포트 추가

import java.util.HashMap;
import java.util.Map;

@RestController // This class indicates that it is a RESTful web service controller.
@RequestMapping("/api/auth") // All endpoints in this controller start with the /api/auth path.
@RequiredArgsConstructor // Lombok: Automatically generates a constructor for final fields to help with dependency injection.
@Slf4j // Lombok: Automatically generates a Logger object for logging.
public class AuthController {

    private final AuthService authService; // AuthService dependency injection

    /**
     * User registration API
     * Receives a registration request from the client and creates user information in Firebase and our DB.
     * @param requestDto Registration request DTO (email, password, nickname, username)
     * @return ResponseEntity<ApiResponse<AuthResponseDto>> Successful registration response
     */
    @PostMapping("/signup") // Maps POST requests to the /api/auth/signup path.
    public ResponseEntity<ApiResponse<AuthResponseDto>> signup(@Valid @RequestBody SignUpRequestDto requestDto) {
        // ⭐ Modified: Added username to the log message
        log.info("Registration request received: Email={}, Nickname={}, Username={}", requestDto.getEmail(), requestDto.getNickname(), requestDto.getUsername());
        try {
            AuthResponseDto responseDto = authService.signup(requestDto);
            // Return success response
            return ResponseEntity.status(HttpStatus.CREATED) // HTTP 201 Created status code
                    .body(ApiResponse.success(responseDto, "회원가입이 성공적으로 완료되었습니다."));
        } catch (IllegalStateException e) {
            log.error("Registration failed: {}", e.getMessage());
            // Handle business logic exceptions (e.g., duplicate email/nickname/username, Firebase user creation failure)
            return ResponseEntity.status(HttpStatus.CONFLICT) // HTTP 409 Conflict status code
                    .body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected registration error occurred: {}", e.getMessage(), e);
            // Other unexpected server errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // HTTP 500 Internal Server Error
                    .body(ApiResponse.error("회원가입 중 서버 오류가 발생했습니다."));
        }
    }

    /**
     * User login API
     * Receives a Firebase ID Token from the client, verifies if user information exists in our DB, and processes login.
     * Actual Firebase authentication should be performed on the client side first.
     * @param requestDto Login request DTO (Firebase ID Token)
     * @return ResponseEntity<ApiResponse<AuthResponseDto>> Successful login response
     */
    @PostMapping("/signin") // Maps POST requests to the /api/auth/signin path.
    public ResponseEntity<ApiResponse<AuthResponseDto>> signin(@Valid @RequestBody SignInRequestDto requestDto) {
        // ⭐ Login request reception log changed to match ID token.
        log.info("Login request received: Firebase ID Token={}", requestDto.getFirebaseIdToken() != null ? requestDto.getFirebaseIdToken().substring(0, 30) + "..." : "null");
        try {
            // ⭐ Passes the Firebase ID Token directly from SignInRequestDto to AuthService.
            AuthResponseDto responseDto = authService.signIn(requestDto.getFirebaseIdToken());

            return ResponseEntity.ok(ApiResponse.success(responseDto, "로그인이 성공적으로 완료되었습니다."));
        } catch (IllegalStateException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // HTTP 401 Unauthorized status code
                    .body(ApiResponse.fail(e.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Login request error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST) // HTTP 400 Bad Request status code
                    .body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected login error occurred: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // HTTP 500 Internal Server Error
                    .body(ApiResponse.error("로그인 중 서버 오류가 발생했습니다."));
        }
    }

    /**
     * Endpoint to retrieve user's email by username.
     * Used when the client logs in with an ID.
     * @param username The username to query
     * @return ApiResponse containing the email corresponding to the username
     */
    @GetMapping("/email-by-username") // ⭐ Added (or replaces existing email-by-nickname)
    public ResponseEntity<ApiResponse<String>> getEmailByUsername(@RequestParam String username) {
        try {
            String email = authService.getEmailByUsername(username);
            return ResponseEntity.ok(ApiResponse.success(email, "아이디에 해당하는 이메일을 성공적으로 조회했습니다."));
        } catch (IllegalStateException e) {
            log.warn("Failed to retrieve email by ID: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND) // 404 Not Found
                    .body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("Server error while retrieving email by ID: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
                    .body(ApiResponse.error("이메일 조회 중 서버 오류가 발생했습니다."));
        }
    }

    /**
     * Endpoint to retrieve user's username by email.
     * Can be used for "Find ID" functionality.
     * @param email The email to query
     * @return ApiResponse containing the username corresponding to the email
     */
    @GetMapping("/username-by-email") // ⭐ Added
    public ResponseEntity<ApiResponse<String>> getUsernameByEmail(@RequestParam String email) {
        try {
            String username = authService.getUsernameByEmail(email);
            return ResponseEntity.ok(ApiResponse.success(username, "이메일에 해당하는 아이디를 성공적으로 조회했습니다."));
        } catch (IllegalStateException e) {
            log.warn("Failed to retrieve ID by email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND) // 404 Not Found
                    .body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("Server error while retrieving ID by email: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // 500 Internal Server Error
                    .body(ApiResponse.error("아이디 조회 중 서버 오류가 발생했습니다."));
        }
    }

    // ⭐ Added: Handler for MethodArgumentNotValidException which occurs on validation failure
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Returns HTTP 400 Bad Request status code
    public ApiResponse<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        log.warn("Validation failed: {}", errors);
        // ApiResponse.fail method should be able to accept Map<String, String> as data.
        return ApiResponse.fail("유효성 검사 실패", errors);
    }
}