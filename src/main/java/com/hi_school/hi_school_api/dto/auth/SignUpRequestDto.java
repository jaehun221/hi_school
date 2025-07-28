package com.hi_school.hi_school_api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter // Lombok: 모든 필드에 대한 getter 메서드 자동 생성
@Setter // Lombok: 모든 필드에 대한 setter 메서드 자동 생성
public class SignUpRequestDto {

    @NotBlank(message = "이메일은 필수 입력 값입니다.") // null, 빈 문자열, 공백만 있는 문자열 허용 안 함
    @Email(message = "유효한 이메일 형식이 아닙니다.") // 이메일 형식 검증
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해주세요.") // ⭐ 비밀번호 길이 제한을 8자로 다시 설정
    private String password; // 이 비밀번호는 Firebase Authentication으로 전달됩니다.

    @NotBlank(message = "닉네임은 필수 입력 값입니다.")
    @Size(min = 2, max = 10, message = "닉네임은 2자 이상 10자 이하로 입력해주세요.") // 닉네임 길이 제한
    private String nickname;

    // ⭐ 추가: 계정 아이디 (username) 필드
    @NotBlank(message = "아이디는 필수 입력 값입니다.")
    @Size(min = 4, max = 15, message = "아이디는 4자 이상 15자 이하로 입력해주세요.") // 아이디 길이 제한 (예시)
    private String username;
}
