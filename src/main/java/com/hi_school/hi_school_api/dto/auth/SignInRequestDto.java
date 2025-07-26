package com.hi_school.hi_school_api.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter // Lombok: 모든 필드에 대한 getter 메서드를 자동으로 생성합니다.
@Setter // Lombok: 모든 필드에 대한 setter 메서드를 자동으로 생성합니다.
public class SignInRequestDto {

    // ⭐ 이메일과 비밀번호 필드를 제거하고, Firebase ID 토큰 필드를 추가합니다.
    @NotBlank(message = "Firebase ID 토큰은 필수 입력 값입니다.")
    private String firebaseIdToken; // 클라이언트가 Firebase SDK를 통해 얻은 ID 토큰
}
