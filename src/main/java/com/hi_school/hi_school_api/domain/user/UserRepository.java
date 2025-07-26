package com.hi_school.hi_school_api.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // 이 인터페이스가 Spring Data JPA 리포지토리임을 나타냅니다.
public interface UserRepository extends JpaRepository<User, String> {
    // JpaRepository<엔티티 타입, 기본 키 타입>

    // 이메일을 통해 사용자를 찾는 메서드. Optional을 사용하여 null 처리의 안정성을 높입니다.
    Optional<User> findByEmail(String email);

    // 닉네임을 통해 사용자를 찾는 메서드.
    Optional<User> findByNickname(String nickname);

    // UID를 통해 사용자가 존재하는지 확인하는 메서드.
    boolean existsByUid(String uid);

    // 이메일을 통해 사용자가 존재하는지 확인하는 메서드.
    boolean existsByEmail(String email);

    // 닉네임을 통해 사용자가 존재하는지 확인하는 메서드.
    boolean existsByNickname(String nickname);
}
