package com.hi_school.hi_school_api.dto.comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    private String author;           // 이메일 등 (안 쓰면 삭제해도 무방)
    private String authorUid;        // 👈 Firebase UID 등
    private String authorNickname;   // 👈 닉네임(또는 displayName)
    private String content;
}
