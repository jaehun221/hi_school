package com.hi_school.hi_school_api.domain.post;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String author;     // 닉네임 등

    private String authorUid;  // 작성자 식별자 (Firebase UID)

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
