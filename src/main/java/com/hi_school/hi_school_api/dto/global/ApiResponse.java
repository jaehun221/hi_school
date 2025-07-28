package com.hi_school.hi_school_api.dto.global;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter; // ⭐ Setter 임포트 추가 (기존 코드에는 없었지만, @Setter가 클래스 레벨에 있으므로 필요)

/**
 * API 응답의 표준 형식을 정의하는 DTO 클래스입니다.
 * 모든 API 응답은 이 형식을 따르도록 하여 일관성을 유지합니다.
 *
 * @param <T> 응답 데이터의 타입
 */
@Getter // Lombok: 모든 필드에 대한 getter 메서드를 자동으로 생성합니다.
@Setter // Lombok: 모든 필드에 대한 setter 메서드를 자동으로 생성합니다. ⭐ 추가
@NoArgsConstructor // Lombok: 기본 생성자를 자동으로 생성합니다. (JSON 직렬화/역직렬화에 필요)
@AllArgsConstructor // Lombok: 모든 필드를 인자로 받는 생성자를 자동으로 생성합니다.
public class ApiResponse<T> {

    private boolean success; // API 요청 성공 여부 (true: 성공, false: 실패)
    private String message;  // 응답 메시지 (성공, 실패, 오류 메시지 등)
    private T data;          // 실제 응답 데이터 (성공 시 반환될 객체)
    private Object errors; // ⭐ 수정: 오류 코드를 Object 타입으로 변경하여 상세 에러 정보를 담을 수 있도록 함

    /**
     * 성공적인 API 응답을 생성합니다.
     *
     * @param data 응답할 실제 데이터
     * @param message 성공 메시지
     * @param <T> 데이터 타입
     * @return 성공 ApiResponse 객체
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data, null);
    }

    /**
     * 데이터 없이 성공적인 API 응답을 생성합니다.
     *
     * @param message 성공 메시지
     * @param <T> 데이터 타입
     * @return 성공 ApiResponse 객체
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    /**
     * 실패한 API 응답을 생성합니다. (클라이언트 요청 오류 등)
     *
     * @param message 실패 메시지
     * @param <T> 데이터 타입
     * @return 실패 ApiResponse 객체
     */
    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    /**
     * ⭐ 추가: 실패 응답을 위한 정적 팩토리 메서드 (메시지와 에러 데이터 포함)
     * 유효성 검사 실패와 같이 상세 에러 정보를 반환할 때 사용됩니다.
     *
     * @param message 실패 메시지
     * @param errors 상세 오류 정보 (예: Map<String, String>)
     * @param <T> 데이터 타입
     * @return 실패 ApiResponse 객체
     */
    public static <T> ApiResponse<T> fail(String message, Object errors) {
        return new ApiResponse<>(false, message, null, errors);
    }

    /**
     * 오류가 발생한 API 응답을 생성합니다. (서버 내부 오류 등)
     *
     * @param message 오류 메시지
     * @param errorCode 오류 코드
     * @param <T> 데이터 타입
     * @return 오류 ApiResponse 객체
     */
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(false, message, null, errorCode); // ⭐ 기존 errorCode를 errors 필드로 전달
    }

    /**
     * 오류가 발생한 API 응답을 생성합니다. (오류 코드 없이 메시지만)
     *
     * @param message 오류 메시지
     * @param <T> 데이터 타입
     * @return 오류 ApiResponse 객체
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }
}
