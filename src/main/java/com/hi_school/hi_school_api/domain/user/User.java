package com.hi_school.hi_school_api.domain.user;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity // 이 클래스가 JPA 엔티티임을 나타냅니다.
@Table(name = "users") // 데이터베이스 테이블 이름을 'users'로 지정합니다.
@Getter // Lombok: 모든 필드에 대한 getter 메서드를 자동으로 생성합니다.
@NoArgsConstructor(access = AccessLevel.PROTECTED) // Lombok: 기본 생성자를 자동으로 생성하며, 외부에서의 직접 생성을 막습니다.
public class User {

    // Firebase UID를 기본 키로 사용합니다.
    // Firebase UID는 고유하며, 사용자 인증의 핵심 식별자입니다.
    @Id
    @Column(name = "uid", nullable = false, unique = true, length = 255)
    private String uid;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "nickname", nullable = false, unique = true, length = 255)
    private String nickname;

    @Column(name = "username", nullable = false, unique = true, length = 50) // length는 DB 컬럼과 일치시키세요.
    private String username;

    // 생성 시간을 자동으로 기록합니다.
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 마지막 수정 시간을 자동으로 기록합니다.
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Lombok의 @Builder를 사용하여 객체 생성을 용이하게 합니다.
    // ⭐ Builder 생성자에 username 필드 추가
    @Builder
    public User(String uid, String email, String nickname, String username) {
        this.uid = uid;
        this.email = email;
        this.nickname = nickname;
        this.username = username; // ⭐ 추가
    }

    // 사용자 정보 업데이트 메서드 (예: 닉네임 변경)
    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }
}