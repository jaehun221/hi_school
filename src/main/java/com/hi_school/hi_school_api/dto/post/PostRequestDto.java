package com.hi_school.hi_school_api.dto.post;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequestDto {
    private String title;
    private String content;
    private String author;
}
