package com.hi_school.hi_school_api.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommentResponseDto {
    private Long id;
    private String author;              // 이메일 or 이름
    private String authorUid;           // 👈 반드시 추가!
    private String authorNickname;      // 👈 닉네임도 따로 쓰면 추가!
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
