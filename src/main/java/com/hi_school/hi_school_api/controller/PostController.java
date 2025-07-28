package com.hi_school.hi_school_api.controller;

import com.hi_school.hi_school_api.dto.post.PostRequestDto;
import com.hi_school.hi_school_api.dto.post.PostResponseDto;
import com.hi_school.hi_school_api.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<Long> createPost(@RequestBody PostRequestDto dto) {
        return ResponseEntity.ok(postService.createPost(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody PostRequestDto dto) {
        postService.updatePost(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    // 게시글 전체 목록 + 페이징 (예시: /api/posts?page=1&size=20)
    @GetMapping
    public ResponseEntity<?> getPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        // PostService에서 전체 글, 페이지 수 등 내려주는 메서드가 필요
        // 예시: return postService.getPosts(page, size);
        return ResponseEntity.ok(postService.getPosts(page, size));
    }
}
