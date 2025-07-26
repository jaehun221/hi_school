package com.hi_school.hi_school_api.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.FirebaseToken;
import com.hi_school.hi_school_api.domain.user.User;
import com.hi_school.hi_school_api.domain.user.UserRepository;
import com.hi_school.hi_school_api.dto.auth.AuthResponseDto;
import com.hi_school.hi_school_api.dto.auth.SignInRequestDto;
import com.hi_school.hi_school_api.dto.auth.SignUpRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final FirebaseAuth firebaseAuth;

    /**
     * 사용자 회원가입 처리
     * Firebase Authentication에 사용자 계정을 생성하고, 우리 DB에도 사용자 정보를 저장합니다.
     * @param requestDto 회원가입 요청 DTO (이메일, 비밀번호, 닉네임)
     * @return AuthResponseDto 인증 응답 DTO (Firebase UID, 이메일, 닉네임, Firebase 토큰)
     * @throws IllegalStateException 이메일, 닉네임 중복 또는 Firebase 사용자 생성 실패 시
     */
    @Transactional(rollbackFor = Exception.class) // ⭐ 개선 제안 1 적용: 명시적 롤백 조건 추가
    public AuthResponseDto signup(SignUpRequestDto requestDto) {
        // 1. 중복 이메일/닉네임 검사 (우리 DB 기준)
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }
        if (userRepository.existsByNickname(requestDto.getNickname())) {
            throw new IllegalStateException("이미 사용 중인 닉네임입니다.");
        }

        // 2. Firebase Authentication에 사용자 생성
        UserRecord.CreateRequest firebaseRequest = new UserRecord.CreateRequest()
                .setEmail(requestDto.getEmail())
                .setPassword(requestDto.getPassword())
                .setDisplayName(requestDto.getNickname()); // 닉네임을 Firebase display name으로 설정

        UserRecord firebaseUser;
        try {
            firebaseUser = firebaseAuth.createUser(firebaseRequest);
            log.info("Firebase user created: UID={}, Email={}", firebaseUser.getUid(), firebaseUser.getEmail());
        } catch (FirebaseAuthException e) {
            log.error("Firebase 사용자 생성 실패: {}", e.getMessage(), e); // 스택 트레이스 출력을 위해 예외 e를 로그의 마지막 인자로 추가
            // IllegalStateException으로 변환하여 던집니다. 원본 예외 e를 원인으로 전달합니다.
            throw new IllegalStateException("Firebase 사용자 생성에 실패했습니다: " + e.getMessage(), e);
        }

        // 3. 우리 DB에 사용자 정보 저장
        User user = User.builder()
                .uid(firebaseUser.getUid())
                .email(firebaseUser.getEmail())
                .nickname(requestDto.getNickname())
                .build();
        userRepository.save(user);
        log.info("Local DB user saved: UID={}, Email={}, Nickname={}", user.getUid(), user.getEmail(), user.getNickname());
        // ⭐ 이 부분의 로그 메시지를 영어로 변경했습니다.

        String firebaseIdToken = null; // 클라이언트가 로그인 후 직접 토큰을 얻도록 유도
        return AuthResponseDto.builder()
                .uid(user.getUid())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .firebaseToken(firebaseIdToken)
                .message("회원가입이 성공적으로 완료되었습니다.")
                .build();
    }

    /**
     * Firebase ID 토큰을 검증하고, 유효하면 해당 사용자 정보를 반환합니다.
     * 이 메서드는 다른 API 요청 시 인증된 사용자인지 확인하는 데 사용됩니다.
     * @param idToken 클라이언트로부터 받은 Firebase ID 토큰
     * @return FirebaseToken (디코딩된 토큰 정보)
     * @throws IllegalStateException 토큰이 유효하지 않거나 Firebase 인증 관련 문제 발생 시
     * @throws IllegalArgumentException 토큰이 null이거나 비어있을 경우
     */
    public FirebaseToken verifyIdToken(String idToken) {
        if (idToken == null || idToken.isEmpty()) {
            throw new IllegalArgumentException("Firebase ID 토큰이 유효하지 않습니다.");
        }
        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
            log.info("Firebase ID Token verified: UID={}", decodedToken.getUid());
            // ⭐ 이 부분의 로그 메시지를 영어로 변경했습니다.
            return decodedToken;
        } catch (FirebaseAuthException e) {
            log.error("Firebase ID 토큰 검증 실패: {}", e.getMessage(), e); // 예외 e를 로그의 마지막 인자로 추가
            // ⭐ 개선 제안 2 적용: 보안에 민감한 내부 메시지 대신 일반적인 메시지 사용
            throw new IllegalStateException("인증 토큰이 유효하지 않습니다. 다시 로그인해 주세요.");
        }
    }

    /**
     * 사용자 로그인 처리 (실제 Firebase 인증은 클라이언트 측에서 수행)
     * 클라이언트가 Firebase SDK를 통해 로그인 성공 후, 해당 사용자 정보를 우리 DB에서 조회하여 반환합니다.
     * @param firebaseToken 클라이언트로부터 받은 Firebase ID 토큰
     * @return AuthResponseDto (Firebase UID, 이메일, 닉네임, Firebase 토큰)
     * @throws IllegalStateException 우리 DB에 사용자 정보가 없거나, Firebase 인증 관련 예외 발생 시
     */
    @Transactional(readOnly = true)
    public AuthResponseDto signIn(String firebaseToken) {
        // 1. Firebase ID 토큰 검증 (이 메서드 내부에서 IllegalStateException 발생 가능)
        FirebaseToken decodedToken = verifyIdToken(firebaseToken);

        // 2. UID를 통해 우리 DB에서 사용자 정보 조회
        Optional<User> optionalUser = userRepository.findById(decodedToken.getUid());
        if (optionalUser.isEmpty()) {
            // ⭐ 개선 제안 3 적용: 사용자 정보를 찾을 수 없을 때 로그 레벨을 WARN으로 변경
            log.warn("User not found in local DB: UID={}", decodedToken.getUid());
            // ⭐ 이 부분의 로그 메시지를 영어로 변경했습니다.
            throw new IllegalStateException("내부 데이터베이스에 해당 사용자 정보가 없습니다. 관리자에게 문의하세요.");
        }
        User user = optionalUser.get();
        log.info("Local DB user found for login: UID={}, Email={}", user.getUid(), user.getEmail());
        // ⭐ 이 부분의 로그 메시지를 영어로 변경했습니다.

        return AuthResponseDto.builder()
                .uid(user.getUid())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .firebaseToken(firebaseToken)
                .message("로그인이 성공적으로 완료되었습니다.")
                .build();
    }
}