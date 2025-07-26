package com.hi_school.hi_school_api.dto.comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    private String author;
    private String content;
}
