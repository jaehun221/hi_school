package com.hi_school.hi_school_api.dto.post;

import lombok.Data;
import java.util.List;

@Data
public class PostsListResponseDto {
    private List<PostResponseDto> posts;
    private int totalPages;
    private long totalCount;

    public PostsListResponseDto(List<PostResponseDto> posts, int totalPages, long totalCount) {
        this.posts = posts;
        this.totalPages = totalPages;
        this.totalCount = totalCount;
    }
}
