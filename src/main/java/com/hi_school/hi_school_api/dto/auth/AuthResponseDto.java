package com.hi_school.hi_school_api.dto.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder // Lombok: 빌더 패턴을 사용하여 객체 생성을 용이하게 합니다.
public class AuthResponseDto {
    private String uid; // Firebase 사용자 고유 ID
    private String email;
    private String nickname;
    private String firebaseToken; // Firebase ID Token
    private String message; // 응답 메시지 (예: "로그인 성공", "회원가입 성공")
}
