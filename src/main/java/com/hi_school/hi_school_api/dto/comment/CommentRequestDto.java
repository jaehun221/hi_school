package com.hi_school.hi_school_api.dto.comment;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class CommentRequestDto {
    private String author;           // 이메일 등 (안 쓰면 삭제해도 무방)
    private String authorUid;        // 👈 Firebase UID 등
    private String authorNickname;   // 👈 닉네임(또는 displayName)
    @Size(max = 200, message = "댓글은 200자 이하로 입력해주세요.") // 200자 제한
    private String content;
    private Long parentId; // 대댓글용 부모 댓글 ID
}
